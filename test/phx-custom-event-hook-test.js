import { fixture } from '@open-wc/testing';
import sinon from 'sinon';
import { expect } from "@esm-bundle/chai";
import PhxCustomEventHook from '../src/phoenix-custom-event-hook';

describe('hook', () => {
  describe('mounted', () => {
    it('sends events', async () => {
      const element = await fixture(`<div phx-send-events="foo,bar" data-thing="wut"></div>`);
      PhxCustomEventHook.el = element;
      PhxCustomEventHook.pushEvent = sinon.spy();
      PhxCustomEventHook.mounted();
      element.dispatchEvent(new CustomEvent('foo', {detail: {bing: 'baz'}}));
      expect(PhxCustomEventHook.pushEvent.args[0][0]).to.equal('foo');
      expect(PhxCustomEventHook.pushEvent.args[0][1]).to.deep.equal({bing: 'baz', thing: 'wut'});
    });

  });

  describe('destroyed', () => {
    it('removes event listeners', async () => {
      const element = await fixture(`<div phx-send-events="foo,bar" data-thing="wut"></div>`);
      PhxCustomEventHook.el = element;
      PhxCustomEventHook.pushEvent = sinon.spy();
      PhxCustomEventHook.mounted();
      PhxCustomEventHook.destroyed();
      element.dispatchEvent(new CustomEvent('foo', {detail: {bing: 'baz'}}));
      expect(PhxCustomEventHook.pushEvent.called).to.be.false;
    });
  });

});