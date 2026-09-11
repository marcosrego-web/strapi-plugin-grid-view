import { PLUGIN_ID } from './pluginId';

/* Stylesheets travel as strings (imported with ?raw) and are put in the document by hand, rather
   than left to the `import './x.css'` an admin app itself can use. A plugin is built as a library:
   vite extracts the stylesheet to a file beside the bundle and drops the import, so a published
   plugin that imports its CSS the ordinary way arrives with no styles at all.

   Each sheet is tagged with an id so a second call cannot double it up. */
export function injectStyles(name: string, css: string) {
    const id = `strapi-plugin-${PLUGIN_ID}-${name}`;

    if (document.getElementById(id)) return;

    const element = document.createElement('style');
    element.id = id;
    element.textContent = css;
    document.head.appendChild(element);
}
