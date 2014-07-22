var expect = require('chai').expect;
var util = require('../../lib/util.js');
var MakeDrive = require('../../../client/src');
var Filer = require('../../../lib/filer.js');

describe('MakeDrive Client - delete some files and restore', function(){
  var provider;

  beforeEach(function() {
    provider = new Filer.FileSystem.providers.Memory(util.username());
  });
  afterEach(function() {
    provider = null;
  });

  /**
   * This test creates multiple files in a dir, syncs, and checks that they exist
   * on the server. It then removes some of the files, and makes sure a downstream sync
   * brings them back.
   */
  it('should sync some files after deleting', function(done) {
    util.authenticatedConnection(function( err, result ) {
      expect(err).not.to.exist;

      var fs = MakeDrive.fs({provider: provider, manual: true});
      var sync = fs.sync;

      var layout = {
        '/dir/file1': 'contents of file1',
        '/dir/file2': 'contents of file2',
        '/dir/file3': 'contents of file3',
        '/dir/file4': 'contents of file4',
        '/file5': 'contents of file5',
        '/file6': 'contents of file6',
        '/file7': 'contents of file5',
        '/dir2': null,
        '/dir3': null,
        '/dir4': null
      };

      sync.once('connected', function onConnected() {
        util.createFilesystemLayout(fs, layout, function(err) {
          expect(err).not.to.exist;

          sync.request('/');
        });
      });

      sync.once('completed', function onUpstreamCompleted() {
        // Make sure all 3 files made it to the server
        util.ensureRemoteFilesystem(layout, result.jar, function() {
          sync.disconnect();
        });
      });

      sync.once('disconnected', function onDisconnected() {
        // Delete a bunch of files and dirs, leaving rest in place
        var pathsToDelete = [
          '/dir/file1',
          '/dir/file3',
          '/file5',
          '/file7',
          '/dir2',
          '/dir4'
        ];

        util.deleteFilesystemLayout(fs, pathsToDelete, function(err) {
          expect(err).not.to.exist;

          // Re-sync with server and make sure we get our files back
          sync.once('connected', function onSecondDownstreamSync() {

            sync.once('disconnected', function onSecondDisconnected() {
              util.ensureFilesystem(fs, layout, function(err) {
                expect(err).not.to.exist;

                done();
              });
            });

            sync.disconnect();
          });

          // Get a new token for this second connection
          util.getWebsocketToken(result, function(err, result) {
            expect(err).not.to.exist;

            sync.connect(util.socketURL, result.token);
          });
        });
      });

      sync.connect(util.socketURL, result.token);
    });
  });

});
