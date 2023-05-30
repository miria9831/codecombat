// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
let ThangNamesCollection;
import ThangType from 'models/ThangType';
import CocoCollection from 'collections/CocoCollection';

export default ThangNamesCollection = (function() {
  ThangNamesCollection = class ThangNamesCollection extends CocoCollection {
    static initClass() {
      this.prototype.url = '/db/thang.type/names';
      this.prototype.model = ThangType;
      this.prototype.isCachable = false;
    }

    constructor(ids) {
      this.ids = ids;
      super();
      this.ids.sort();
    }

    fetch(options) {
      if (options == null) { options = {}; }
      _.extend(options, {data: {ids: this.ids}});
      return super.fetch(options);
    }
  };
  ThangNamesCollection.initClass();
  return ThangNamesCollection;
})();
