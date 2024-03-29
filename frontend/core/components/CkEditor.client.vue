<template>
        <ckeditor :editor="editor" :value="value" :config="config" :tagName="tagName" :disabled="disabled" @input="event => $emit('input', event)" />
  </template>
  
<script>
import xClassicEditor from '@ckeditor/ckeditor5-build-classic'
import xCKicEditor from '@ckeditor/ckeditor5-vue'

let ClassicEditor;
let CKEditor;

if (process.client) {
    ClassicEditor = xClassicEditor
    CKEditor = xCKicEditor
} else {
    CKEditor = { component: { template: '<div></div>' } };
}

export default {
    components: {
        ckeditor: CKEditor.component,
    },
    props: {
        value: String,
        tagName: {
            type: String,
            default: 'div',
        },
        disabled: Boolean,
        uploadUrl: String,
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            editor: ClassicEditor,
        };
    },
};
</script>