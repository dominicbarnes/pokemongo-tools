
0.16.10 / 2019-07-23
====================

  * feat(catalog): add filters for season 1 regionals and jungle cup
  * chore(metadata): update

0.16.9 / 2019-07-04
===================

  * feat(catalog): add jungle cup filter

0.16.8 / 2019-05-29
===================

  * feat(catalog): add Rainbow Cup filter

0.16.7 / 2019-05-27
===================

  * chore: fix vue-template-loader

0.16.6 / 2019-05-23
===================

  * chore(npm): update
  * chore(metadata): update
  * feat(travis): cache ~/.npm when using npm ci
  * chore(travis): pin to node 10 for builds
  * feat(catalog): move legacy moves badge to the same line as the move type badges
  * feat(catalog): move stats above power-up card
  * feat(catalog): add badge for pokemon with legacy moves
  * chore(deps): update POGOProtos

0.16.5 / 2019-04-20
===================

  * feat(catalog): add nightmare cup, remove unnecessary sort

0.16.4 / 2019-04-14
===================

  * feat(catalog): add kingdom cup filter
  * chore: update POGOProtos

0.16.3 / 2019-03-30
===================

  * fix: use real mdash instead of html entity
  * chore(metadata): update and rebuild

0.16.2 / 2019-02-24
===================

  * chore: npm update
  * chore: npm update

0.16.1 / 2019-02-24
===================

  * feat(catalog): add Tempest Cup for Silph League
  * chore: npm update
  * chore(metadata): update and rebuild
  * chore(metadata): update
  * chore: downgrade postcss to fix vue issues
  * chore: update dependencies
  * build: switch to npm ci

0.16.0 / 2019-01-28
===================

  * feat(catalog): add Twilight Cup to filters
  * feat(catalog): add league filter
  * chore(package): update deps
  * feat(catalog): add 2nd charge move to move type badges
  * chore: update POGOProtos

0.15.2 / 2019-01-02
===================

  * chore: update deps
  * refactor: move defensive type chart to pokedex, remove offensive type chart from catalog
  * fix(catalog): correctly bind pokemon id to quick move selector in tm modal
  * feat: sort types alphabetically in filters
  * feat(calculators): add basic CP calculator

0.15.1 / 2018-12-21
===================

  * fix(catalog): do not autofocus pokemon when prefilled

0.15.0 / 2018-12-21
===================

  * fix(catalog): fix type chart
  * feat(catalog): add type chart to view page (fixes #6)
  * feat(select-move): add support for alternate forms
  * feat(select-pokemon): add autofocus support
  * fix(pokedex): restore icon scale
  * feat(iv-calculator): add ability to add to catalog (fixes #42)
  * fix(iv-calculator): various UI improvements
  * fix(iv-calculator): support 'lucky' and 'not powered-up' checkboxes (fixes #41)
  * feat: add IV Calculator
  * feat(service-worker): cache all PogoAssets URLs
  * fix(select): handle unset and properly show label
  * fix(catalog): add missing PokemonIcon ref to add/edit form
  * chore(deps): update POGOProtos and mine script
  * refactor: add pokemon-icon component
  * feat(select): add type badges to pokemon options
  * feat(catalog): use vue-multiselect for better pokemon and move selection
  * fix(catalog): restore shiny badge ref
  * fix(catalog): ensure that great/ultra league buttons show up when relevant
  * feat(catalog): add helpers to find great/ultra league levels
  * feat(catalog): show notes on view page
  * feat(catalog): support 2nd charge move

0.14.0 / 2018-12-15
===================

  * feat(types): new UI
  * chore: update submodules
  * feat(catalog): have level slider span whole row
  * feat(catalog): new and improved power up card
  * chore: update submodules
  * feat(catalog): add max cp/hp stats
  * feat(catalog): add cp filter
  * chore(package): update dependencies
  * chore(metadata): regenerate
  * fix(metadata): handle default form when normal is not available
  * feat(pokedex): support alternate forms (fixes #16)
  * feat(pokedex): hide evolutions card when not relevant

0.13.0 / 2018-11-24
===================

  * chore(dependencies): update POGOProtos
  * feat(pokedex): port new filter system from catalog
  * feat(metadata): pull every 1m, rather than only on load
  * feat(types): rewrite types page to be more useable (fixes #2)
  * fix(service-worker): workbox@3 updates, precache pokemon 000 icon
  * test(travis-ci): fix gitmodules so it will work on CI, switch back to master for game-master
  * feat(service-worker): upgrade to workbox@3, add caching for icons
  * chore(metadata): process versions in proper order
  * feat(metadata): switch from node-pogo-protos-vnext to using POGOProtos directly
  * chore(metadata): build using a branch to get stat rebalance + meltan family
  * refactor(catalog): use updated vuex hoodie module
  * refactor(store): rewriting vuex internals regarding hoodie
  * feat: remove analytics/tracking
  * feat(catalog): initial implementation of lists
  * feat(catalog): add presets for iv and level filters
  * feat(catalog): add move filters, fix level filter
  * feat(catalog): rewrite filter ui and internals in preparation for lists

0.12.0 / 2018-11-08
===================

  * chore(metadata): update and rebuild
  * feat(catalog): mirror variant for alert + progress bar for level
  * feat(catalog): make evolve modal responsive
  * fix(catalog): make sort-by more robust to missing values
  * fix(catalog): properly sort ivs when missing added
  * chore(metadata): update submodule
  * chore(metadata): update
  * feat(metadata): include special moves
  * feat(catalog): add lucky flag
  * refactor(catalog): clean up badge and progress components
  * fix(catalog): some filters got broken during the last big refactor
  * feat(catalog): stop showing common badge
  * feat(catalog): add helpers for badge variants, use consistently for ivs and level
  * refactor: remove unused slugify dep
  * refactor(catalog): use 4 per row and adapt content accordingly
  * chore(metadata): update node-pogo-protos-vnext and rebuild
  * chore: update game-master for gen 4
  * dev: add script for only mining local data
  * fix(catalog): show added at when not yet updated
  * feat(catalog): clean up list view
  * feat(catalog+pokedex): clean up some badges
  * feat(catalog): remove added date from list
  * refactor: put fallback sprite url behind a shared getter
  * fix(catalog): if no move, do not attempt to decorate
  * refactor(catalog): break down into smaller components

0.11.0 / 2018-10-13
===================

  * fix(catalog): handle more cases in the evolve modal
  * fix(catalog): handle forms that are missing metadata (eg: normal)
  * refactor: fully retire old sprite components
  * feat(catalog): use new sprite system for evolve modal
  * feat(metadata): add 'Fragment Hat' for Pikachu family
  * chore(metadata): update
  * fix(metadata): handle alt form evolutions correctly
  * chore(package): update deps
  * feat(catalog): undicate uncertain stats on list
  * feat(pokedex): clean up moves list
  * metadata(moves): update game-master, add more details
  * fix(catalog): fix common rarity filter
  * feat(pokedex-view): add left/right navigation
  * refactor(pokedex): break into smaller components

0.10.3 / 2018-08-22
===================

  * fix: stop form submit handlers (mostly for mobile)

0.10.2 / 2018-08-22
===================

  * fix(catalog): fix all non-default filters
  * feat(catalog): add support for filtering by level + iv ranges
  * fix(catalog): fix evolves filter

0.10.1 / 2018-08-19
===================

  * feat(img-fallback): do not set img src if already that value
  * fix: update pokemon icon base url

0.10.0 / 2018-08-17
===================

  * metadata: rebuild
  * feat: add support for costumes

0.9.0 / 2018-08-17
==================

  * fix(catalog): various sprite fixes
  * metadata: rebuild
  * feat(metadata): parse all versions again
  * feat(metadata): set default form to normal when multiple forms detected
  * feat(pokedex): add img src fallback for missing sprites
  * fix(import): restore pull before mine
  * feat: support unown forms and use better asset images
  * feat(metadata): import alternate unown forms

0.8.2 / 2018-07-28
==================

  * fix(catalog): update form to handle new move metadata

0.8.1 / 2018-07-28
==================

  * chore: add pokemongo-game-master submodule
  * fix(pokedex): update for new metadata
  * chore(couchdb): regenerate data
  * feat(import): reference pokemongo-game-master directly

0.8.0 / 2018-07-20
==================

  * feat(catalog): add alert about uncertain stats to view page
  * feat(catalog): add 'uncertain stats' flag, keyword search notes
  * chore(package): update deps
  * feat(metadata): generate separate moves for each hidden power type
  * refactor(catalog): item cleanup
  * fix(catalog): add bottom margin to buttons

0.7.0 / 2018-07-15
==================

  * feat(catalog): add support for hidden power type
  * fix(catalog): improve evolve + tm modals (fixes #38)
  * chore(metadata): update
  * feat(catalog): add shiny filter (fixes #37)
  * perf(catalog): bypass vuex for queueing changes
  * perf(catalog): debounce change stream
  * feat: add user profile (fixes #7)
  * content: move footer content to home page

0.6.0 / 2018-07-05
==================

  * feat(catalog): sorting by ivs should use cp
  * feat(catalog): add bulk deletion (fixes #29)
  * fix(catalog): fix nickname add/edit
  * fix(catalog): fix evolve button
  * fix(catalog): fix stat calculations for add form
  * feat(catalog): add filter for forms (fixes #31)
  * feat(catalog): add filter for moves (fixes #35)
  * perf(metadata): use fewer mutations
  * fix(metadata): format alternate forms like the base pokemon
  * fix(catalog): show alternate forms when available
  * fix(catalog): fix date sorting via custom mapper
  * chore(package): update deps
  * refactor(catalog): clean up internals, particularly around vuex
  * fix: lint
  * refactor(store): clean up store/hoodie interactions
  * feat(catalog): add calculated ivs to form
  * chore: update metadata

0.5.0 / 2018-06-15
==================

  * feat: do not uppercase abbr.initialism
  * dev: upgrade up
  * feat(catalog): add level badge
  * feat(catalog): add sort/filter by level
  * feat(catalog): add power-up costs
  * fix(catalog): syntax error in history card
  * feat: remove max cp from graphql import, add upgrade costs
  * feat(catalog): use card columns, move action buttons inline
  * dev: add precommit hook via husky
  * feat(catalog): add badge for wonder
  * feat(catalog): use progress bars to visualize stats
  * feat(catalog): add split button for max power up
  * feat(catalog): add calculated cp/hp to form

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
