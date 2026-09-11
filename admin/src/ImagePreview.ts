import styles from './ImagePreview.css?raw';
import { injectStyles } from './injectStyles';

// The two places Strapi shows an image big enough to be worth seeing in full: the popover it opens
// over a media cell in the list view, and the carousel on a media field in an entry.
const PREVIEW_SELECTOR = 'div[data-radix-popper-content-wrapper],[aria-roledescription="slide"]';

/* Strapi puts a thumbnail in both, and keeps the original beside it under the same name without the
   prefix - so blowing one up to fill the screen (see ImagePreview.css) otherwise fills it with a
   245px image. Only the file name is rewritten, never the rest of the URL: an upload folder or a
   CDN host with "thumbnail_" somewhere in it would take the naive replacement with it. */
function showFullSizeImages(container: ParentNode) {
    container.querySelectorAll('img').forEach(image => {
        const marker = '/thumbnail_';
        const at = image.src.lastIndexOf(marker);

        if (at === -1) return;

        image.src = image.src.slice(0, at + 1) + image.src.slice(at + marker.length);
    });
}

/* Both are portalled in on hover, long after the page itself rendered, so there is nothing to hook
   into but the DOM. Only added nodes are read - the images are swapped once each, and rewriting a
   src is itself a mutation, so anything broader would feed itself. */
export function setupImagePreview() {
    injectStyles('image-preview', styles);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;

                if (node.matches(PREVIEW_SELECTOR)) showFullSizeImages(node);

                node.querySelectorAll(PREVIEW_SELECTOR).forEach(showFullSizeImages);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}
