import { Message } from "element-ui";
export default {
    methods: {
        onEditRender(field) {
            if (!field.name) field.name = "$input";
            let editRender = {};
            switch (field.name) {
                case "$select" || "$radio":
                    editRender = {
                        name: field.name,
                        options: field.options,
                        optionProps: field.optionProps,
                        props: { multiple: field.multiple },
                    };
                    break;
                case "$input":
                    editRender = {
                        name: "$input",
                        props: { type: field.type, placeholder: field.placeholder },
                    };
                    break;
            }
            return editRender;
        },
        activeCellMethod({ row, column }) {
            let noEditStatus = this.noEditFields[column.title] ? false : true;
            // if (!noEditStatus)
            //     Message({
            //         message: `<${column.title}>禁止编辑`,
            //         type: "error",
            //         duration: 1000,
            //     });
            return noEditStatus;
        },
        async editClosed(event) {
            const $table = this.$refs.xTable;
            this.autoFormData = this.editRow;
            const updateRecords = $table.getUpdateRecords();
            if (!updateRecords.length) return;
            // this.onSubmit(this.editConfig);
            this.$emit("editClosed", event)

        },
        // 双击编辑校验
        async editValid() {
            const errMap = await this.$refs.xTable.validate(true).catch(errMap => errMap);
            return errMap == undefined;
        },
    }
}