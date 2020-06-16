# vscode-open
If you are the type of programmer who have an specific folder on your machine with all your projects and you like `vscode`. This little CLI helps you to easily open one of the projects directly from you terminal.

## Motivation
Of course you can use another methods to achieve this rapidly open between workspace, but the available options are:

- Create yourself a bash script to easily open for you.
- Load all projects as a single global workspace in vscode, making it heavy.
- Navigate to te project folder using terminal and running `code my-project-folder/`.
- Opening from the confusing vscode `recently opened workspaces` menu option.

## Installation and configuration
Clone this project

```bash
cd to/some/folder

git clone https://github.com/ffrm/vscode-open.git
```

Install [Deno](https://deno.land/), or download it portable version.

Create an alias for the `cli.ts` file inside your `.profile` or `.bash_profile`

```bash
alias vscode-open="deno run --allow-read --allow-run --unstable /to/some/folder/cli.ts --vscode-workspace=\"/path/to/your/vscode-workspace\""
```

### Flags

`--allow-read` - Required `Deno flag` to gain read access to your workspace. Can also allow only the workspace folder as `--allow-read=/path/to/your/workspace`.

`--allow-run` - Required `Deno flag` to call exec methods.

`--unstable` - As Deno have some unstable packages it needs to be declared.

`--vscode-workspace` - Folder containing your development projects. It will be the folder where `vscode-open` will list projects.

## Openning a workspace with `vscode-open`

Call the CLI and wait for list, then select one of the listed projects.

```bash
vscode-open
```

or directly open a known project:

```bash
vscode-open name-of-the-project
```

## Future
- [ ] Support list select like in [inquirer](https://www.npmjs.com/package/inquirer).
- [ ] Create an extension to display common workspaces on vscode initial screen.