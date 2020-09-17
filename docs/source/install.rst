Installation
=============

Please follow instructions from `<https://github.com/neoresearch/neocompiler-eco>`_.

Cloning from GitHub
-------------------

To clone OptFrame repository from GitHub:

.. code-block:: shell

   git clone https://github.com/neoresearch/neocompiler-eco.git


Linux Installation
-------------------

After cloning, you can build everything::

   ./build_everything.sh

This is likely to *take a while*, if you haven't downloaded any of the docker
containers yet.

.. warning::
   This process will consume several gigabytes in disk for docker images and dependencies.

Why does it take so long?
^^^^^^^^^^^^^^^^^^^^^^^^^

Local installation will download all available compiling suite (C#, Python, Go, ...) and also
setup a local privatenet for testing.

