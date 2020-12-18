import { deepMerge, isFunction, dataset, certainProperty } from '@/utils';
import { __plugins, __event } from '@/options';

export const bootstrap = (that) => {
    // eslint-disable-next-line
    const { conf, refresh, params, fn, event, id } = that;

    const app = {
        refs(k) {
            const { upsert, table, [`adv-search`]: advSearch } = that.$refs;

            that.refs = {
                table: table.$refs['table'],
                upsert: upsert.$refs['form'],
                'adv-search': advSearch.$refs['form'],
            };

            return k ? that.refs[k] : that.refs;
        },

        component() {
            return that;
        },

        getData(p) {
            return dataset(
                certainProperty(that, [
                    'service',
                    'conf',
                    'tips',
                    'dict',
                    'table',
                    'search',
                    'upsert',
                    'pagination',
                    'params',
                    'layout',
                ]),
                p
            );
        },

        setData(p, d) {
            deepMerge(
                that,
                dataset(
                    certainProperty(that, [
                        'service',
                        'conf',
                        'tips',
                        'dict',
                        'table',
                        'search',
                        'upsert',
                        'pagination',
                        'params',
                        'layout',
                    ]),
                    p,
                    d
                )
            );
        },

        setForm(k, v) {
            that.$refs['upsert'].form[k] = v;
        },

        setAdvForm(k, v) {
            that.$refs['adv-search'].form[k] = v;
        },

        getForm(k) {
            const { form } = that.$refs['upsert'];
            return k ? form[k] : form;
        },

        getAdvForm(k) {
            const { form } = that.$refs['adv-search'];
            return k ? form[k] : form;
        },

        hiddenItem(k, v = true) {
            app.setData(`upsert.items[prop:${k}].hidden`, v);
        },

        hiddenColumn(k, v = true) {
            app.setData(`table.columns[prop:${k}].hidden`, v);
        },

        hiddenAdvItem() {
            app.setData(`search.adv.items[prop:${k}].hidden`, v);
        },

        getItemRef(prop) {
            return that.refs['upsert'].$refs[prop];
        },

        getAdvItemRef(prop) {
            return that.refs['adv-search'].$refs[prop];
        },

        changeSort(prop, order) {
            that.changeSort(prop, order);
        },

        clearSort() {
            that.clearSort();
        },

        delete(...d) {
            that.rowDelete.apply(this, d);
        },

        info(d) {
            return that.service.info(d);
        },

        add(d) {
            that.rowAdd(d);
        },

        append(d) {
            that.rowAppend(d);
        },

        edit(d) {
            that.rowEdit(d);
        },

        close() {
            that.rowClose();
        },

        reset() {
            that.reset();
        },

        submit() {
            return that.$refs['upsert'].save();
        },

        renderList(d) {
            that.table.data = d;
            that.table.loading = false;
        },

        setPagination(d) {
            deepMerge(that.pagination, d);
        },

        refresh(d) {
            return isFunction(d) ? d(that.params, refresh) : refresh(d);
        },

        doLayout(key) {
            if (key === 'table') {
                that.$refs['table'].calcHeight();
            }
        },

        paramsReplace(p) {
            return that.paramsReplace(p);
        },
    };

    const ctx = (data) => {
        deepMerge(that, data);

        return ctx;
    };

    ctx.id = id;

    ctx.conf = (d) => {
        deepMerge(conf, d);

        return ctx;
    };

    ctx.service = (d) => {
        that.service = d;
        return ctx;
    };

    ctx.permission = (x) => {
        if (isFunction(x)) {
            x();
        } else {
            deepMerge(that.permission, x);
        }

        return ctx;
    };

    ctx.set = (n, x) => {
        let a = that[n];
        let b = isFunction(x) ? x(a) : x;

        if (n === 'table') {
            if (b.props) {
                const { order, prop } = b.props['default-sort'] || {};

                params.order = !order ? '' : order === 'descending' ? 'desc' : 'asc';
                params.prop = prop;
            }
        }

        if (n === 'adv') {
            a = that.search.adv;
        }

        if (n === 'layout') {
            that[n] = b;
        } else {
            deepMerge(a, b);
        }

        return ctx;
    };

    ctx.on = (name, cb) => {
        if (Object.keys(that.fn).includes(name)) {
            that.fn[name] = cb;
        } else {
            event[name] = cb;
        }

        return ctx;
    };

    ctx.once = (name, cb) => {
        event[name] = {
            mode: 'once',
            callback: cb,
        };

        return ctx;
    };

    ctx.done = async (cb) => {
        const next = async () => {
            if (fn.permission) {
                that.permission = deepMerge(await fn.permission(that), that.permission);
            }

            that.done();
        };

        if (isFunction(cb)) {
            await cb(next);
        } else {
            next();
        }
    };

    return { ctx, app };
};
