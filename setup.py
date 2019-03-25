# -*- coding: utf-8 -*-
from setuptools import setup, find_packages
import os

version = '0.9.dev0'

README = open("README.rst").read()
HISTORY = open(os.path.join("docs", "HISTORY.rst")).read()

setup(name='ulearn5.js',
      version=version,
      description="uLearn ECMAScript dedicated package",
      long_description=README + "\n" + HISTORY,
      classifiers=[
          "Environment :: Web Environment",
          "Framework :: Plone",
          "Operating System :: OS Independent",
          "Programming Language :: Python",
          "Programming Language :: Python :: 2.6",
          "Programming Language :: Python :: 2.7",
          "Topic :: Software Development :: Libraries :: Python Modules",
      ],
      keywords='JS ECMASCript uLearn5',
      author='PloneTeam',
      author_email='ploneteam@upcnet.es',
      url='https://github.com/UPCnet/ulearn5.js',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['ulearn5'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          'five.grok',
          'jarn.jsi18n'
      ],
      extras_require={'test': ['plone.app.testing',
                               'plone.app.testing[robot]>=4.2.2',
                               'plone.app.robotframework[debug]',]},
      entry_points="""
      # -*- Entry points: -*-
      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
