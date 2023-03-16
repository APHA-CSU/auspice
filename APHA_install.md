# Install instructions for APHA SCE

Install Node Version Manager (nvm)

`wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`

Install node.js v18 (the latest supported by Auspice)

`nvm install 18`

Clone Auspice repo

`git clone https://github.com/APHA-CSU/auspice.git`

Install argparse (required by Auspice)

`cd auspice && npm install argparse`

Build Auspice

`npm install --global .`

Correct installation of Auspice can be confirmed with `auspice --help`
