import {walkSync, WalkEntry} from 'https://deno.land/std/fs/mod.ts';
import {parse as parseFlags} from 'https://deno.land/std/flags/mod.ts';
import { exec } from "https://deno.land/x/exec/mod.ts";
import Ask from 'https://deno.land/x/ask/mod.ts';

const { log: print } = console;

const flags = parseFlags(Deno.args);
const WORKSPACE_ROOT = flags['vscode-workspace'];
const PRE_SELECTED_WORKSPACE: string | null = flags._.length ? flags._[0].toString() : null;

type Workspace = {
  name: string,
  path: string,
};

async function listWorkspaces(root: string): Promise<Workspace[]> {
  const workspaces: Workspace[] = [];
  const walkOptions = {
    maxDepth: 1,
    includeFiles: false,
  };
  for (const entry of walkSync(root, walkOptions)) {
    const { name, path }: WalkEntry = entry;
    // desconsider root path
    if (path !== root) {
      workspaces.push({ name, path });
    }
  }
  return workspaces;
}

function mapWorkspacesToMessage(workspaces: Workspace[]) {
  return workspaces
    .map(({ name }, index) => `(${index}) ${name}`)
    .join('\n');
}

async function openWorkspace(workspace: Workspace) {
  const { name, path } = workspace;
  print(`opening "${name}" workspace…`);
  await exec(`code ${path}`);
}

async function promptUser(workspaces: Workspace[]): Promise<Workspace> {
  const ask = new Ask();
  const questions = [
    {
      name: 'workspace',
      type: 'input', // currently only supported by ask
      message: `\n${mapWorkspacesToMessage(workspaces)}\nSelect a workspace to open on vscode:`,
    }
  ];
  return ask
    .prompt(questions)
    .then(({ workspace }) => parseInt(workspace))
    .then((workspaceIndex) => {
      if (!workspaces[workspaceIndex]) {
        throw new Error('Index out of range');
      }
      return workspaces[workspaceIndex];
    });
}

function findWorkspaceInList(workspaces: Workspace[], workspaceName: string): Workspace | undefined {
  return workspaces.find(({ name }) => name === workspaceName);
}

(async function() {
  const workspaces = await listWorkspaces(WORKSPACE_ROOT);
  let selectedWorkspace;
  if (PRE_SELECTED_WORKSPACE) {
    selectedWorkspace = findWorkspaceInList(workspaces, PRE_SELECTED_WORKSPACE);
  } else {
    selectedWorkspace = await promptUser(workspaces);
  }
  if (!selectedWorkspace) {
    return Deno.exit(1);
  }
  openWorkspace(selectedWorkspace);
})();