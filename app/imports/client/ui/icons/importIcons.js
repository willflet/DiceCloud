import { writeIcons } from '/imports/api/icons/Icons';
import { snackbar } from '/imports/client/ui/components/snackbars/SnackbarQueue';

/*
 * Import a SVG sprite file.
 *
 * A svg sprite file can be created by downloading the entire archive of
 * https://game-icons.net/ then using the search function with *.svg to copy
 * all the individual files into a single directory, and then using
 * `npm i -g svg-sprite-generator` `npm i -g xml-js`
 * run `svg-sprite-generate -d icons -o sprite.xml`
 * run `xml-js sprite.xml --out sprite.json --compact true `
 * to save the sprite file as json.
 */
let metadata;

export function importIcons(file) {
  if (!metadata) {
    snackbar({ text: 'Upload the metadata JSON first.' });
    return;
  }

  const reader = new FileReader();

  reader.onload = async function () {
    try {
      const data = JSON.parse(reader.result);
      console.log('Sprite JSON top-level keys:', Object.keys(data || {}));
      const symbols = Array.isArray(data?.svg?.symbol)
        ? data.svg.symbol
        : data?.svg?.symbol
          ? [data.svg.symbol]
          : [];
      console.log('Number of symbols:', symbols.length, 'first symbol:', symbols[0]);
      const icons = [];
      symbols.forEach(iconData => {
        const attrs = iconData?._attributes || iconData?.attributes || iconData || {};
        const name = attrs.id || attrs.ID || attrs.name || attrs.key;
        let shape;
        const path = iconData?.path;
        if (Array.isArray(path)) {
          shape = (path[1] || path[0])?._attributes?.d || (path[1] || path[0])?.d || (path[1] || path[0]);
        } else if (path && typeof path === 'object') {
          shape = path._attributes?.d || path.d || path;
        } else {
          shape = path;
        }
        if (!name || !shape) {
          console.warn('Skipping icon with missing name/shape:', iconData);
          return;
        }
        const icon = { ...(metadata[name] || {}) };
        icon.name = name;
        icon.shape = shape;
        icons.push(icon);
      });
      await writeIcons.callAsync({ icons });
      snackbar({ text: `Imported ${icons.length} icons.` });
    } catch (error) {
      console.error(error);
      snackbar({ text: error?.reason || error?.message || String(error) });
    }
  };

  reader.onerror = function () {
    snackbar({ text: 'Failed to read the file.' });
  };

  reader.readAsText(file);
}

// Get metadata here:
// https://gist.github.com/ThaumRystra/ffb264dea8c32e15de95f775596194a4
// It is probably out of date though
export function importIconMetadata(file) {
  const reader = new FileReader();

  reader.onload = function () {
    try {
      metadata = JSON.parse(reader.result);
      snackbar({ text: 'Metadata loaded.' });
    } catch (error) {
      console.error(error);
      snackbar({ text: 'Failed to parse metadata JSON.' });
    }
  };

  reader.onerror = function () {
    snackbar({ text: 'Failed to read the file.' });
  };

  reader.readAsText(file);
}