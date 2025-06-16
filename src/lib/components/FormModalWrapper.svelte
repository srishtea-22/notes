<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from 'svelte'; 

    export let isOpen: boolean;
    export let title: string = 'Modal Title';

    const dispatch = createEventDispatcher<{ close: void }>();

    function closeOnEsc(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            dispatch('close');
        }
    }

    onMount(() => {
        if (isOpen) {
            window.addEventListener('keydown', closeOnEsc);
        }
    });

    onDestroy(() => {
        window.removeEventListener('keydown', closeOnEsc);
    });

    $: if (isOpen) {
        window.addEventListener('keydown', closeOnEsc);
    } else {
        window.removeEventListener('keydown', closeOnEsc);
    }
</script>

{#if isOpen}
<!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="fixed inset-0 backdrop-blur flex items-center justify-center z-50 p-4"
        on:click|self={() => dispatch('close')}
    >
        <div
            class="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full transform transition-all scale-100 opacity-100 relative"
            on:click|stopPropagation
        >
            <button
                on:click={() => dispatch('close')}
                class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none"
                aria-label="Close modal"
            >
                &times;
            </button>
            <h3 class="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">{title}</h3>

            <slot />
        </div>
    </div>
{/if}