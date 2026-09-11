import type { StrapiApp } from '@strapi/strapi/admin';

import { GridView, setupGridView } from './GridView';
import { setupImagePreview } from './ImagePreview';
import { PLUGIN_ID } from './pluginId';

export default {
    register(app: StrapiApp) {
        app.registerPlugin({
            id: PLUGIN_ID,
            name: PLUGIN_ID,
            initializer: null,
            isReady: true,
        });

        setupGridView();      // the card layout, and the view the last visit left on
        setupImagePreview();  // full-size images under the two hovers that show one
    },

    /* Injected from bootstrap rather than register: the admin runs every plugin's register before
       any bootstrap, and the i18n plugin fills this same zone with its locale picker from its own
       bootstrap. Going last is what puts this button between that picker and the view settings cog
       - from register it would land to the left of the picker instead. */
    bootstrap(app: Pick<StrapiApp, 'getPlugin'>) {
        app.getPlugin('content-manager').injectComponent('listView', 'actions', {
            name: PLUGIN_ID,
            Component: GridView,
        });
    },
};
