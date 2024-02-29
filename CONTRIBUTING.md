<!--
SPDX-FileCopyrightText: 2024 Erik Michelson <opensource@erik.michelson.eu>

SPDX-License-Identifier: MIT
-->

# Contributing

Thanks for your interest in contributing to this project!
Please follow the following steps to contribute:

1. Open an issue to discuss the change you want to make. After discussing the change and getting approval, you can
   proceed to the next step.
2. Fork the repository and do your changes. Make sure to sign-off your commits (see below).
3. Open a pull request and reference the issue you opened in step 1.

## Sign-off your commits

By contributing to this project you agree to the [Developer Certificate of Origin (DCO)](DCO.txt). This document was
created by the Linux Kernel community and is a simple statement that you, as a contributor, have the legal right to make
the contribution. The DCO is a legally binding statement, please read it carefully.

If you can certify it, then just add a line to every git commit message:

```
Signed-off-by: Random J Developer <random@developer.example.org>
```

Use your real name (sorry, no pseudonyms or anonymous contributions).

The sign-off message can either be added by hand to your commit message or automatically by git.
This is accomplished by using the -s or --signoff option on your regular commit command.
It will use the name and email you configured in git.

```shell
git commit -s
```

The last commit on any given branch can be amended to include the sign-off message like this:

```shell
git commit --amend -s
```


## Code quality

Please make sure to add tests for your changes. Also, make sure that your code passes the existing tests by running:

```shell
npm test
``` 

This project uses [biome](https://biomejs.dev/) for linting and formatting. You can fix your code to adhere to the code
style by running:

```shell
npm run fix
```
