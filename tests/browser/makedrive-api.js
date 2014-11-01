var MakeDrive = window.MakeDrive;
var expect = window.expect;

describe('MakeDrive Client API', function(){
  describe('Core API', function() {
    var provider;

    beforeEach(function(done) {
      done();
    });
    afterEach(function() {
      provider = null;
    });

    it('should have expected methods and properites', function() {
      // Bits copied from Filer
      expect(MakeDrive.Buffer).to.be.a.function;
      expect(MakeDrive.Path).to.exist;
      expect(MakeDrive.Path.normalize).to.be.a.function;
      expect(MakeDrive.Errors).to.exist;

      // MakeDrive.fs()
      expect(MakeDrive.fs).to.be.a.function;
      var fs = MakeDrive.fs({memory: true, manual: true});
      var fs2 = MakeDrive.fs({memory: true, manual: true});
      expect(fs).to.equal(fs2);

      // MakeDrive.fs().sync property
      expect(fs.sync).to.exist;
      expect(fs.sync.on).to.be.a.function;
      expect(fs.sync.off).to.be.a.function;
      expect(fs.sync.connect).to.be.a.function;
      expect(fs.sync.disconnect).to.be.a.function;
      expect(fs.sync.sync).to.be.a.function;

      // Sync States
      expect(fs.sync.SYNC_DISCONNECTED).to.equal("SYNC DISCONNECTED");
      expect(fs.sync.SYNC_CONNECTING).to.equal("SYNC CONNECTING");
      expect(fs.sync.SYNC_CONNECTED).to.equal("SYNC CONNECTED");
      expect(fs.sync.SYNC_SYNCING).to.equal("SYNC SYNCING");
      expect(fs.sync.SYNC_ERROR).to.equal("SYNC ERROR");
      expect(fs.sync.state).to.equal(fs.sync.SYNC_DISCONNECTED);
    });
  });
});
