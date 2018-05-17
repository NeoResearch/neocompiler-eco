<p align="center">
    <img
      src="http://res.cloudinary.com/dnh3we6el/image/upload/v1519941321/NeoResearch-Logo.png"
      width="125px;">
</p>

<h1 align="center">neo-opt-tests</h1>

## What is it

This project has its main focus on establishing a set of parameters that will be subjected to optimization and statical analyses in order to check csharp [neo-cli](https://github.com/neo-project/neo-cli) consensus capabilities, or other client implemented in any other languages.
In this sense, this repository comprises a set of scripts and docker containers to build and publish a [private network](https://github.com/NeoResearch/neo-privatenet-docker.git), along with a set of python tests to run through.
It posses the potential of improving performance of the Neo blockchain and finding optimization opportunities.

Furthermore, the scope of this project is to engage Neo community into this topic.
Thus, competitions will be promote and their calls will be available at the folder `competition`.
Our focus is to engage a wide public, from developers to advanced users.

In particular, this private network is usually created with new modified characteristics from [neo blockchain](https://github.com/neo-project/neo/), with assist of the procedures inside folder `docker-build-neo-cli`.

This is a work in progress, areas to be improved:

* Identify parameters that could be optimized and their impact on consensus behavior:
  - Check bottlenecks: on opcodes (.avm) readings execution; decoding transactions; communicating; changing view; broadcasting; among other.
  - Verify robustness: check the possibility of executing a graph optimization problem (using mathematical programming models of metaheuristics inspired procedures), described on the ongoing project [ODBFT](https://github.com/NeoResearch/ODBFT), which would balance find a consensus that balance efficiency and risk.  
* Create an automatic procedure for easily set these variables and report characteristics of the network:
  - Automatic CPU time reporting on the aforementioned points;
  - Automatic reports on the interaction with different interfaces of Neo ecosystem.
* Run several batches of experiments:
  - Involve different Neo developers in order to execute this containers and report their results;
  - Possible, design a competition and co-working scheme for granting prizes to those that performed outstanding reports.
* Integrate this project into a self-adaptive TestNet:
  - Testnet would be reset sporadically and nodes would get new parameters;
  - All nodes would receive necessary amount of Neo and GAS for serving as consensus or acting in the network as normal users.
  - In this sense, neo-cli nodes would automatically synchronize and try to find the most suitable set of parameters.  
* As mentioned in the original project:
  - Investigate using docker compose and improve the image build process so it's more suitable for CI;
  - Improve speed of build process, suspect we can use cache a little more for our containers.

## How to build and Run a `neo-privatenet-neoresearch-integrations` image

### Simple and easy

This procedure requires two steps (A1 and -A2 or A3-), all of them described below.

#### A1 - Build everything and generated a personalized image of the desired private blockchain ecosystem

1. Run `commit_modified_privatenet.sh`

Basically, this step commits an image with all nodes already running with a genesis wallet.

Jump to step 2 or 3.

#### A2 - Execute a personalized privatenet

1. After going to the root folder of this project, run the new committed `neo-privatenet-opt-tests` with  `docker_run_integrations_privatenet.sh`
1. Access the Docker virtual environment with `bash-priv_integrations_privatenet.sh`
1. Currently, inside the docker container, you can monitor the blockchain accessing `/neo-python` and typing `neopy`, as well as checking neo-cli nodes (currently, static set to 4) in its attached screens.

#### A3 - Execute all master functionalities (neo-scan + debugging private net)

1. After going to the root folder of this project, simply run `build_everything.sh`

### Other additional possibilities and features

#### F1 - Only create a modified neo-cli with modified neo-blockchain or neo-cli files

1. Go to `docker-build-neo-cli` folder
1. Execute the script `docker_build_run_copy_stop`
  - As result, a new `neo-cli-built` will be copied to this folder
