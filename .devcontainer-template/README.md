## Instructions for Dev Containers plugin

1. Rename this folder into .devcontainer/
2. Update devcontainer.json according to your docker (or podman) system
3. If docker is rootless, you will need to:
   - Uncomment `"remoteUser": "root"`
   - Make sure your docker sock is correct (in this example, this is `/run/user/1001/docker.sock`)
4. For rootful docker, sock may be on `/var/run/docker.sock`
5. For rootless podman, you may need to adjust other things, such as podman compose (not covered here)
