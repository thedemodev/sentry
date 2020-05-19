import React from 'react';

import {shallow, mountWithTheme} from 'sentry-test/enzyme';
import CheckboxFancy from 'sentry/components/checkboxFancy/checkboxFancy';

describe('CheckboxFancy', function() {
  it('renders', function() {
    const wrapper = shallow(<CheckboxFancy />);
    expect(wrapper).toMatchSnapshot();
  });

  it('isChecked', function() {
    const wrapper = mountWithTheme(<CheckboxFancy isChecked />);
    expect(wrapper.props().isChecked).toEqual(true);
    expect(wrapper.find('[data-test-id="icon-check-mark"]').exists()).toEqual(true);
    expect(wrapper.find('[data-test-id="icon-subtract"]').exists()).toEqual(false);
  });

  it('isIndeterminate', function() {
    const wrapper = mountWithTheme(<CheckboxFancy isIndeterminate />);
    expect(wrapper.props().isIndeterminate).toEqual(true);
    expect(wrapper.find('[data-test-id="icon-check-mark"]').exists()).toEqual(false);
    expect(wrapper.find('[data-test-id="icon-subtract"]').exists()).toEqual(true);
  });

  it('isDisabled', function() {
    const wrapper = mountWithTheme(<CheckboxFancy isDisabled />);
    expect(wrapper.props().isDisabled).toEqual(true);
    expect(wrapper.find('[data-test-id="icon-check-mark"]').exists()).toEqual(false);
    expect(wrapper.find('[data-test-id="icon-subtract"]').exists()).toEqual(false);
  });
});
