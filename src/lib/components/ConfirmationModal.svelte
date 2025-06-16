<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    export let isOpen: boolean; 
    export let message: string = "Are you sure you want to proceed?";
    export let item: string = '';
    const dispatch = createEventDispatcher<{ confirm: void; cancel: void}>();

    function confirm() {
        dispatch('confirm');
    }
    function cancel() {
        dispatch('cancel');
    }
</script>

<div class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-poppins">
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full transform transition-all scale-100 opacity-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirm Action</h3>
        <p class="text-gray-700 mb-6">
            {message} {item ? `'${item}'` : ''}?
        </p>
        <div class="flex justify-end space-x-3">
            <button
                on:click={cancel}
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-150 ease-in-out cursor-pointer"
            >
                Cancel
            </button>
            <button
                on:click={confirm}
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-150 ease-in-out cursor-pointer"
            >
                Delete
            </button>
        </div>
    </div>
</div>