// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
let ChooseAccountTypeView;
import 'app/styles/modal/create-account-modal/choose-account-type-view.sass';
import CocoView from 'views/core/CocoView';
import template from 'app/templates/core/create-account-modal/choose-account-type-view';
import utils from 'core/utils';

export default ChooseAccountTypeView = (function() {
  ChooseAccountTypeView = class ChooseAccountTypeView extends CocoView {
    static initClass() {
      this.prototype.id = 'choose-account-type-view';
      this.prototype.template = template;
  
      this.prototype.events = {
        'click .teacher-path-button'() { return this.trigger('choose-path', utils.isOzaria ? 'teacher' : 'oz-vs-coco'); },
        'click .student-path-button'() { return this.trigger('choose-path', 'student'); },
        'click .individual-path-button'() { return this.trigger('choose-path', 'individual'); },
        'input .class-code-input': 'onInputClassCode',
        'submit form.choose-account-type': 'onSubmitStudent',
        'click .parent-path-button'() {
          if (location.pathname === '/parents') {
            return this.trigger('choose-path', 'individual');
          } else {
            return application.router.navigate('/parents', {trigger: true});
          }
        }
      };
    }

    initialize({ signupState }) {
      this.signupState = signupState;
    }

    getClassCode() { return this.$('.class-code-input').val() || this.signupState.get('classCode'); }

    onInputClassCode() {
      const classCode = this.getClassCode();
      return this.signupState.set({ classCode }, { silent: true });
    }

    onSubmitStudent(e) {
      e.preventDefault();

      this.onInputClassCode();
      this.trigger('choose-path', 'student');
      return false;
    }
  };
  ChooseAccountTypeView.initClass();
  return ChooseAccountTypeView;
})();
