
0.4.0 / 2018-06-07
==================

  * fix(catalog): finish removing migrate logic
  * chore(pkg): update deps
  * feat(catalog): remove migration logic
  * fix(utils): lint issue
  * feat(catalog): add great level migration script
  * fix(utils): minimum hp is 10
  * feat(catalog): prepare for the great level migration
  * feat(catalog): better ui for power up
  * fix(store): support half-levels for calculation
  * fix: lint
  * feat(catalog): add helper for converting cp/hp -> level
  * feat(catalog): add basic level support
  * feat: add cp multipliers metadata
  * metadata: update
  * fix(pokemon-sprite): handle alolan forms
  * feat(catalog): add basic alternate form support
  * feat(import): fetch latest
  * feat(import): add delay between retries
  * feat(pokemon): add basic alternate form support
  * feat(catalog): reorder filters
  * feat(filters): convert types to checkbox + badge
  * fix(pokedex): move filters to left and fix padding
  * fix(catalog): restore sort and add
  * feat: switch to sidebar filters
  * chore(package): update deps

0.3.5 / 2018-04-09
==================

  * config: disable warming in case it's causing high KMS usage (apex/up#642)

0.3.4 / 2018-04-07
==================

  * feat(catalog): keyword searches species name and nickname
  * fix(travis): install up from github releases
  * metadata: update

0.3.3 / 2018-03-24
==================

  * refactor: move markdown to global filters
  * fix(catalog): broken notes/markdown
  * perf: use key for list items
  * feat: increments of 12 seem better
  * feat: use increments of 24 for pagination (divisible by 2/3/4)
  * refactor: add paginated-list component

0.3.2 / 2018-03-12
==================

  * fix(catalog): handle loading page directly before metadata is ready

0.3.1 / 2018-03-11
==================

  * security: add rel=noopener to target=_blank links

0.3.0 / 2018-03-11
==================

  * feat: add warming for production
  * build: remove full-paths config
  * refactor: reduce build size

0.2.0 / 2018-03-11
==================

  * feat(pokedex+catalog): use flex for footer nav
  * refactor(badges): drop badge suffix on filenames
  * feat(pokedex+catalog): use more breakpoints
  * feat(catalog): show more items per row on xl screens
  * feat(catalog): improve evolves filter
  * feat(catalog): reduce debounce threshold for filters
  * refactor(catalog): remove dead filter code
  * feat(pokedex+catalog): add generation badge and filter
  * feat(catalog): add badge with tooltip for notes
  * fix(catalog): sort recent by caught & added to allow out-of-order entries more gracefully
  * fix: load script after snippet to ensure analytics is defined

0.1.1 / 2018-03-04
==================

  * feat: rename 'Github' to 'Source Code'
  * feat: add version to footer
  * refactor: use long vue syntax for event binding
  * feat(catalog): show available moves at top of move select

0.1.0 / 2018-03-04
==================

  * build: use npm version for cutting releases
  * refactor: add evolution family filters, switch to selects for most filters
  * chore(dependencies): update
  * fix(metadata): flatten family into string id
  * build: refactor import to make updating remote easier
  * metadata: add families
  * refactor(import): rely on upstream id scheme, add families

0.0.2 / 2018-02-25
==================

  * analytics: track 'User Registered'
  * refactor: use sift module for array filtering
  * refactor: move filters to components
  * dev: do not start service worker locally
  * build: remove deploy scripts
  * refactor: add more directories
  * build(travis-ci): hide upgrade progress bar during deploy

0.0.1 / 2018-02-22
==================

  * public launch
