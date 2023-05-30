// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
let SingleSignOnConfirmView;
import 'app/styles/modal/create-account-modal/sso-confirm-view.sass';
import CocoView from 'views/core/CocoView';
import BasicInfoView from 'views/core/CreateAccountModal/BasicInfoView';
import template from 'app/templates/core/create-account-modal/single-sign-on-confirm-view';
import forms from 'core/forms';
import User from 'models/User';

export default SingleSignOnConfirmView = (function() {
  SingleSignOnConfirmView = class SingleSignOnConfirmView extends BasicInfoView {
    static initClass() {
      this.prototype.id = 'single-sign-on-confirm-view';
      this.prototype.template = template;
  
      this.prototype.events = _.extend({}, BasicInfoView.prototype.events, {
        'click .back-button': 'onClickBackButton'
      });
    }

    initialize(param) {
      if (param == null) { param = {}; }
      const { signupState } = param;
      this.signupState = signupState;
      return super.initialize(...arguments);
    }

    afterRender() {
      super.afterRender();
      if (this.signupState.get('path') === 'teacher') {
        return this.$('form').submit();
      }
    }

    onClickBackButton() {
      this.signupState.set({
        ssoUsed: undefined,
        ssoAttrs: undefined
      });
      return this.trigger('nav-back');
    }


    formSchema() {
      return {
        type: 'object',
        properties: {
          name: User.schema.properties.name
        },
        required: []
      };
    }
  };
  SingleSignOnConfirmView.initClass();
  return SingleSignOnConfirmView;
})();
