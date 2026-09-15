import * as React from 'react';
import { IconButton } from '@strapi/design-system';
import { GridFour, List } from '@strapi/icons';
import { useLocation } from 'react-router-dom';

import styles from './GridView.css?raw';
import { injectStyles } from './injectStyles';
import { PLUGIN_ID } from './pluginId';

/* Grid view is a class on the body, which GridView.css hangs its card layout off. Keeping it there
   rather than in React state is what lets one button restyle a table it does not own, and lets
   anyone else style against the same class. */

const GRID_VIEW_CLASS = 'grid-view';

/* An app embedding a list view of its own - a picker in an iframe, say - can pin the view by adding
   this class to the body next to grid-view. Nothing below will touch the class again, and no
   preference is spent on a view the person browsing never asked for. */
const PINNED_CLASS = 'grid-view-pinned';

const STORAGE_KEY = `strapi-plugin-${PLUGIN_ID}`;

/* The preference is kept per collection type, since a table of short fields and a table of covers
   are not browsed the same way: one answer for all of them is the wrong answer for some of them.
   The type is read from the URL - /content-manager/collection-types/<uid> - which is also what
   changes when someone moves between them. */
const COLLECTION_TYPE_PATH = /\/content-manager\/collection-types\/([^/?#]+)/;

function collectionTypeFrom(pathname: string) {
    return pathname.match(COLLECTION_TYPE_PATH)?.[1] ?? null;
}

function storedPreferences(): Record<string, boolean> {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

        // Anything that isn't a table of them - unreadable, or the single boolean kept here before
        // the preference was per type - starts over rather than throwing at the first read.
        return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    } catch {
        return {};
    }
}

function storedPreference(uid: string | null) {
    return uid ? storedPreferences()[uid] === true : false;
}

function applyGridView(on: boolean) {
    if (document.body.classList.contains(PINNED_CLASS)) return;

    document.body.classList.toggle(GRID_VIEW_CLASS, on);
}

function setGridView(uid: string | null, on: boolean) {
    applyGridView(on);

    if (!uid) return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...storedPreferences(), [uid]: on }));
    } catch {
        // Private browsing, or storage that is full or blocked. The view still changes - it just
        // won't be there again tomorrow, which is no reason to leave the click doing nothing.
    }
}

// Called from register() (see index.ts) with whichever list view the admin is being opened on, so
// the class is on the body before anything is painted.
export function setupGridView() {
    injectStyles('grid-view', styles);

    applyGridView(storedPreference(collectionTypeFrom(window.location.pathname)));
}

export const GridView = () => {
    const { pathname } = useLocation();
    const uid = collectionTypeFrom(pathname);
    const [gridView, setGridViewState] = React.useState(() => storedPreference(uid));

    /* In a layout effect, so the class is swapped before the browser paints and moving between two
       collection types never shows the view the other one was left in. On mount as well as on a
       change of type: the list view unmounts on the way to an entry and back, so by the time it
       returns the body can be carrying a class this type never asked for. */
    React.useLayoutEffect(() => {
        const stored = storedPreference(uid);

        applyGridView(stored);
        setGridViewState(stored);
    }, [uid]);

    const toggle = () => {
        const next = !gridView;

        setGridView(uid, next);  // the body class, and the choice to come back to for this type
        setGridViewState(next);  // which of the two icons this button is showing
    };

    return (
        <IconButton label={gridView ? 'List view' : 'Grid view'} onClick={toggle}>
            {gridView ? <List /> : <GridFour />}
        </IconButton>
    );
};
