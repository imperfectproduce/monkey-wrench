# monkey-wrench
JS :monkey: :wrench:  

## Publishing
Monkey-wrench is published to Github Packages under the @imperfectproduce scope. Released packages can be viewed [here](https://github.com/imperfectproduce/monkey-wrench/packages).
### Publishing to the stable release channel
CircleCI will automatically publish tags matching a semver pattern `/^v([0-9]+)\.([0-9]+)\.([0-9]+)$/`.  Publishing can most easily be accomplished by running:
- `yarn version`
- `git push --follow-tags`
### Publishing to other release channels
Sometimes it's necessary to publish to other channels.  These publishes must be done manually.  Here is an example of publishing a beta version:
- `npm login --registry https://npm.pkg.github.com`
  - _*NOTE* we login using npm becuase yarn does not support authentication necessary for private packages_
- `yarn version --new-version 1.2.3-beta.0`
- `git push --follow-tags`
- `yarn publish --tag beta`