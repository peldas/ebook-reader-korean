<script lang="ts">
  import flip from '@popperjs/core/lib/modifiers/flip';
  import offset from '@popperjs/core/lib/modifiers/offset';
  import { createPopper } from '@popperjs/core/lib/popper-lite';
  import type { Instance } from '@popperjs/core';
  import { tick } from 'svelte';
  import { clickOutside } from '$lib/functions/use-click-outside';
  import { browser } from '$app/env';
  import { popovers } from './popover';

  export let content = '';
  export let singlePopover = true;

  let contentElement: HTMLElement;
  let iconElement: HTMLElement;
  let popoverElement: HTMLElement;

  let id: symbol;
  let instance: Instance;
  let isOpen = false;

  $: if (browser) {
    id = Symbol('popover');
  }
  $: if (isOpen && singlePopover && !$popovers.includes(id)) {
    isOpen = false;
  }

  function conditionalClickHandlerAndClass(node: HTMLElement, conditionFulfilled: boolean) {
    if (conditionFulfilled) {
      node.classList.add('cursor-pointer');
      node.addEventListener('click', toggleOpen, false);
    } else {
      node.classList.remove('cursor-pointer');
      node.removeEventListener('click', toggleOpen, false);
    }

    return {
      destroy() {
        node.removeEventListener('click', toggleOpen, false);
      }
    };
  }

  async function toggleOpen() {
    if (isOpen) {
      popovers.remove(id);
    } else if (singlePopover) {
      popovers.replace(id);
    } else {
      popovers.add(id);
    }

    isOpen = !isOpen;
    await tick();

    if (isOpen && instance) {
      instance.state.elements.popper = popoverElement;
      instance.update();
    } else if (isOpen) {
      instance = createPopper($$slots.icon ? iconElement : contentElement, popoverElement, {
        placement: 'top',
        modifiers: [
          flip,
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['left', 'bottom', 'right']
            }
          },
          offset,
          {
            name: 'offset',
            options: {
              offset: [0, 10]
            }
          }
        ]
      });
    }
  }
</script>

<div data-popover class="flex items-center">
  <div use:conditionalClickHandlerAndClass={!$$slots.icon} bind:this={contentElement}>
    <slot />
  </div>
  <div use:conditionalClickHandlerAndClass={$$slots.icon} bind:this={iconElement}>
    <slot name="icon" />
  </div>
</div>

{#if isOpen}
  <div
    data-popover
    class="max-w-60vw z-10 whitespace-pre-wrap rounded bg-[#333] p-2 text-sm font-bold text-white md:max-w-lg"
    bind:this={popoverElement}
  >
    <div
      use:clickOutside={({ target }) => {
        if (!(target instanceof Element && target.closest('[data-popover]'))) {
          toggleOpen();
        }
      }}
    >
      {content}
    </div>
  </div>
{/if}