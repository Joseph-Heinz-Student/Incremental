# Changelog

## [v0.4.1-alpha] - 2024-09-25

Minor update to the market

### Added

- A save button above the save timer, so you don't have to wait for the game to save, if you have to close the tab or something
- A very simple supply and demand system to the market, so if you start selling massive amounts of resources, the price goes down in order to mimic real life- sort of

### Changed

- Color of the minebar
- Balancing changes to the rock-iron exchange rate
- Price modes in the market now change every 10 ticks, instead of having a 25% chance every tick

## [v0.4.0-alpha] - 2024-09-24

Large content update, mainly focused on the market

### Added

- Added pickaxes which the player needs to buy in order to mine a certain resource
- Floating number after mining a resource, QOL to help the player not have to do mental math 
- Render player stats to the sidebar
- The market is locked until the player has `1 Rock`
- `updateMarket` function to re-render the tables after price changes
- Added the basis for `Notification` API to be used in the future
- Added `Chart.js`, which display a chart of the history of the sell values of the resources
- Added 5 modes for a price to be in:
  - slowRise
  - slowFall
  - stable
  - fastRise
  - fastFall
- Utility function for getting random array item

### Changed

- Market is no longer a const, and it gets saved to the localStorage so prices can stay and not get cheesed by reloading

## [0.3.1-alpha] - 2024-09-20

Minor QOL changes

### Added

- In-page console, in case of player's not having access to the inspect console
- A display of the player's current resources on the market page, so they don't have to change the page constantly
- A list of the player's current stats on the sidebar
- Luck stat
- Upgrade for luck in the upgrades panel
- Connected the auto mine button to have the need for the auto mine store item purchased

## [0.3.0-alpha] - 2024-09-20

New major content for the alpha version

### Added

- Auto mine checkbox, which lets the player auto mine resources
- A store, similar to the upgrades panel, but only contains game changing one time purchases

### Fixed 
- Some floating point errors with the players resources when selling or trading to the market
- Added `let` to some variables that are initialized in `for` and `if` statements, just best practice I think

### Changed
- Some little things with putting `new Decimal`s inside of `numeral`s for rendering

## [v0.2.1-alpha] - 2024-09-19

Built off of the system from the previous version of the upgrade system

### Added

- Calculations for player stats based off of purchased upgrades

### Changed

- Modifiers in an upgrade from a object to and array, to allow for more than one modifier per upgrade

## [v0.2.0-alpha] - 2024-09-19

Functionality for upgrade system

### Added

- Upgrades to the player, such as mining speed
- Player stats, currently only mining speed

## [v0.1.1-alpha] - 2024-09-18

Update to the market and base game

### Added

- System to sell resources to the market
- Money, a new player resource

## [v0.1.0-alpha] - 2024-09-18

New major prerelease content update

### Added

- Foundation for market system
  - Currently only has a functional trading system (resources for resources)
- Many new libraries, like Decimaljs and Numeraljs to help with working with numbers
- New resource iron
  - Player can now choose what resource to mine through a dropdown

### Fixed

- Fixed error with loading new resources from updates

## [v0.0.2-alpha] - 2024-09-17

Fixing the issue with progress bar variance was the main focus of this update.

### Added

- Custom event emitter to allow the addition of resources whenever the progress bar gets filled up
- Save and load system
  - Activates every 30 seconds when the save timer is completed

## [v0.0.1-alpha] - 2024-09-16

Minimal viable product of the minimal viable product, basically no gameplay

### Added

- Rendering for custom time based progress bars
- Rendering for player resource counts

## Versions

[v0.4.1-alpha](https://github.com/Joseph-Heinz-Student/Incremental/releases/tag/v0.4.1-alpha)

[v0.4.0-alpha](https://github.com/Joseph-Heinz-Student/Incremental/releases/tag/v0.4.0-alpha)

[v0.3.1-alpha](https://github.com/Joseph-Heinz-Student/Incremental/releases/tag/v0.3.1-alpha)

[v0.3.0-alpha](https://github.com/Joseph-Heinz-Student/Incremental/releases/tag/v0.3.0-alpha)

[v0.2.1-alpha](https://github.com/Joseph-Heinz-Student/Incremental/releases/tag/v0.2.1-alpha)

[v0.2.0-alpha](https://github.com/Joseph-Heinz-Student/Incremental/releases/tag/v0.2.0-alpha)

[v0.1.1-alpha](https://github.com/Joseph-Heinz-Student/Incremental/releases/tag/v0.1.1-alpha)

[v0.1.0-alpha](https://github.com/Joseph-Heinz-Student/Incremental/releases/tag/v0.1.0-alpha)

[v0.0.2-alpha](https://github.com/Joseph-Heinz-Student/Incremental/releases/tag/v0.0.2-alpha)

[v0.0.1-alpha](https://github.com/Joseph-Heinz-Student/Incremental/releases/tag/v0.0.1-alpha)
