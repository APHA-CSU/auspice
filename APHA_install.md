# Install instructions for APHA SCE

Install Node Version Manager (nvm)

`wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`

Install node.js (the latest supported by Auspice)

`nvm install --lts`

Clone Auspice repo

`git clone https://github.com/APHA-CSU/auspice.git`

Install argparse (required by Auspice)

`cd auspice && npm install argparse`

Install Auspice

`npm install --global .`

Correct installation of Auspice can be confirmed with `auspice --help`

Run Auspice Build to add APHA specific customizations.  This only needs to be
done for the first use or when changes are made to the repo.

`mkdir ../nextstrain && cd ../nextstrain`
`auspice build --extend ../auspice/Customization/custom.json`

Run auspice to display data on *localhost*.  This needs to be run from the
directory where auspice build was run (i.e. nextstrain/ )

`auspice view --datasetDir <path to json files>`
