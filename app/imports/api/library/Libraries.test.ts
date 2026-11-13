import { assert } from 'chai';
import '/imports/api/simpleSchemaConfig';
import { insertLibrary } from '/imports/api/library/Libraries';

// ValidatedMethod does not expose its validate function in the type
// declarations, but it is attached to the instance at construction.
const validate = (insertLibrary as unknown as {
  validate: (args: Record<string, unknown>) => void;
}).validate;

describe('libraries.insert validation', function () {
  it('applies the sharing defaults for the library creation dialog payload', function () {
    const library: Record<string, unknown> = {
      name: 'New Library',
      description: undefined,
    };

    validate(library);

    assert.equal(library.name, 'New Library');
    assert.deepEqual(library.readers, []);
    assert.deepEqual(library.writers, []);
    assert.equal(library.public, false);
  });

  it('rejects a library without a name', function () {
    assert.throws(() => validate({}));
  });
});
