Introduction
============

NeoCompiler-Eco project started in early 2018, seeking to provide easy online access to
`Neo Blockchain <https://neo.org>`_ compiling suite for C# `Smart Contracts <https://en.wikipedia.org/wiki/Smart_contract>`_,
also called *NeoContract*.
The project evolved quickly by supporting other popular languages for NeoContract,
such as Python, Java and Go, and also supporting online testing network, a concept called `Shared PrivateNet <./concepts#shared-privatenet.html>`_.

The first version was published online on `<https://neocompiler.io>`_, which is still under frequent maintainance up to 2020.
The product NeoCompiler-Eco is developed and maintained by `NeoResearch Community <https://neoresearch.io>`_, including many
collaborators from the `GitHub project <https://github.com/neoresearch/neocompiler-eco>`_.

What about the Eco?
-------------------

The *Eco* is an abbreviation for *ecosystem*, as the platform itself is able to support the whole development
cycle of a smart contract, including: compiling, deploying and testing.

.. hint::
    Although not recommended, the online platform is also capable of deploying and executing *real* transactions on a
    *real network* (such as MainNet or TestNet).
    A more secure approach is to do this `locally on your own computer <./install.html>`_.


An Online Laboratory
--------------------

More than a development tool for smart contracts, NeoCompiler-Eco platform supports many testing tools
for Neo Blockchain itself, named *EcoLab*:

- Message monitoring and timing analysis for `dBFT <https://github.com/neo-project/neo>`_ consensus
- Disassembly for `NeoVM <https://github.com/neo-project/neo-vm>`_ operations (*opcodes*)
- Creation and submission of arbitrary transactions
- Monitoring of storage states for Neo Blockchain, including latest NeoX cross-chain operations

.. hint::
   All of this can also be done in **your machine**! Just `clone the repository <./install.html>`_ and run things locally.

Acknowledgements
-----------------

.. role::  raw-html(raw)
    :format: html

Neo Foundation has supported the project since its early phases, and without that 
it wouldn't be possible!
A special thanks goes to all dozens of developers that fixed small bugs and gave amazing suggestions
to make this platform better.

NeoCompiler-Eco is *open-source* and made with :raw-html:`&hearts;` for Neo Ecosystem.

Contributors
------------

Several contributors made this possible, please refer to 
the `NeoCompiler-Eco project on GitHub <https://github.com/neoresearch/neocompiler-eco>`_.

This project is maintained by `NeoResearch Community`_.

License
-------

Project is free, and source code is released under MIT license.

See complete :doc:`license <../license>`.

|neoresearch_official|
NeoResearch Logo

.. |neoresearch_official| image:: ./_figs/logo_neoresearch.png
   :width: 300
   :alt: NeoResearch Logo

|neoresearch_pioneer|
NeoResearch First Logo (Historical)

.. |neoresearch_pioneer| image:: ./_figs/logo_pionner.png
   :width: 100
   :alt: NeoResearch First Logo
