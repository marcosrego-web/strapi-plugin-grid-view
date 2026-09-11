# Strapi plugin grid view

<img src="logo.svg" width="96" alt="">

Two ways to see media in the Strapi content manager.

**Grid view** adds a button to the list view, next to the view settings cog, that switches it
between Strapi's table and a card grid. The choice is remembered per collection type, per browser -
a table of covers can stay a grid while a table of short fields stays a table.

<img src="screenshot.svg" width="960" alt="">

**Image previews** put the full-size image on screen wherever Strapi already offers a look at one:
the popover over a media cell in the list view, and the carousel on a media field in an entry. Both
normally show a thumbnail, so the file name is swapped for the original on the way in.

> Worth knowing before you install: a preview therefore downloads the original file rather than the
> ~245px thumbnail Strapi generated. That is the point - a thumbnail stretched over the screen is
> not worth looking at - but on a library of large uploads it is real bandwidth, paid on hover.

Built for Strapi 5, admin only - it adds no routes, content types or server code.

## Installation

```bash
npm install strapi-plugin-grid-view
# or
yarn add strapi-plugin-grid-view
```

Installed plugins are enabled by default, so there is nothing to configure. To turn it off without
uninstalling, add it to `config/plugins.ts`:

```ts
export default () => ({
  'grid-view': { enabled: false },
});
```

## Styling

Grid view is a class on the document body, so anything else can style against it too:

```css
body.grid-view table[role="grid"] > tbody > tr {
  /* your own card */
}
```

Adding `grid-view-pinned` to the body alongside it pins the view: the plugin then leaves the class
alone instead of setting it per collection type on every navigation. Useful when the list view is
embedded as a picker and should always be a grid, whatever the person browsing normally prefers.

The plugin's own rules are in [admin/src/GridView.css](admin/src/GridView.css). They lay the table
rows out as cards and give the first image cell a checkerboard backdrop, in both the light and dark
admin themes. The preview rules are in [admin/src/ImagePreview.css](admin/src/ImagePreview.css).

Both stylesheets are inlined into the bundle and injected into `<head>` at register time, so there
is nothing for you to import.

## Development

The plugin is built with [@strapi/sdk-plugin](https://github.com/strapi/sdk-plugin).

```bash
yarn install
yarn build          # emits dist/, which the exports field points at
yarn watch          # rebuild on change
yarn test:ts        # typecheck
```

To try a change in a real Strapi app, `yarn watch:link` rebuilds on change and pushes the package
through [yalc](https://github.com/wclr/yalc); on the app side, `yalc add strapi-plugin-grid-view`.

`@strapi/design-system` and `@strapi/icons` are pinned rather than ranged: 2.2.4 ships a
`dist/index.d.ts` that imports its own `src/`, which isn't in the tarball, and TypeScript then reads
every export of the package as missing. Only the published types are affected, not the runtime API,
so the peer ranges stay open.

## Publishing

```bash
yarn build
yarn verify         # checks package.json and that the exports exist in the tarball
npm publish         # --access public on a scoped name
```

`files` ships `dist` only. Bump the version first: consumers resolve the admin entry through the
`exports` map, so a broken build is a broken install.

## Licence

MIT
