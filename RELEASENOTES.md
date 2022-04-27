# blue-button-match Release Notes

## v1.5.1 - April 26, 2022

- Patch Update: Upgraded all dependencies
- Converted tests and coverages to jest

## v1.5.0 - June 14, 2015
- Monor bug fixes

## v1.2.0 - September 15, 2014
- Fixed support for new payers section.
- Minor bug fixes.

## v1.1.0 - September 2, 2014
- Uses blue-button.js v1.1.0 JSON data model
- Improved match detection
	- Now returns all source and destination matches.
	- Uses JSON schemas for easy match tuning/expansion.
	- Percentages on every match return.
	- Depricated 'diff' return.

## v1.0.1 - June 25,2014
- Uses blue-button.js v1.0.2 JSON data model

## v1.0.0 - May 31, 2014

This is the initial release of blue-button-match.js library.

- Uses blue-button.js v1.0.0 JSON data model
- Detects new/duplicate entries
	- Based on deep equal comparison of JSON objects
- Detects partial matches
	- See matching rules explanation in documentation
- Comprehensive set of tests against common scenarios
- Node.js support only (no browser support)
- Published as NPM package
	- to install/use `npm install blue-button-match`


