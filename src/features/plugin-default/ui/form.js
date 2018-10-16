import { Input } from 'antd';
import store from '../../../common/store';

const byId = id => store.getState().home.elementById[id];
const nameMeta = () => ({
  key: 'name',
  label: 'Name',
  widget: Input,
  autoFocus: true,
  required: true,
});

export default {
  fillMeta(args) {
    switch (args.formId) {
      case 'core.element.add.file':
      case 'core.element.add.folder':      
        args.meta.elements.push(
          nameMeta(),
        );
        break;
      default:
        break;
    }
  },
  preSubmit(args) {
    return Promise.resolve();
  },
  processValues(args) {
    const { context, values, formId } = args;
    switch (formId) {
      case 'core.element.add.file': 
      case 'core.element.add.folder': {
        let target = byId(context.targetId);
        let name;
        if (target.type === 'folder') name = target.id + '/' + values.name;
        else if (target.type === 'file') name = target.id.replace(/\/[^/]$/, '/' + values.name);
        else if (target.type === 'folder-alias' && target.target) name = target.target + '/' + values.name;
        else throw new Error('Unkonwn target type to add a file: ', target.type);
        return {
          ...values,
          commandName: 'add',
          type: context.elementType,
          name,
        };
      }
      default:
        break;
    }
    return args;
  },
};
