## What is it

This dockerfile was initialize designed in [AshRolls/neo-integration-tests](https://github.com/AshRolls/neo-integration-tests).

The main idea is that neo-cli client can be easily modified with new parameters from its project and the main Neo-Core library [neo blockchain](https://github.com/neo-project/neo/).

# How to use

Include your modify files with `ADD` or `COPY` commands in the docker files, then:

* Just run `docker_build_run_copy_stop.sh` and waits for:
  - An error :(
  - Or will successfully build neo-cli
