import _ from 'lodash';
import store from '../../common/store';
// import * as monaco from 'monaco-editor';

const initialContent = {};
const absFilePath = filePath => {
  const prjRoot = store.getState().home.projectData.projectRoot;
  if (filePath.startsWith(prjRoot)) return filePath;
  return prjRoot + filePath;
  // store.getState().home.projectData.projectRoot + filePath;
}

const getUri = _.memoize(file => monaco.Uri.file(file));
const modelManager = {
  getModel(filePath, content, noCreate) {
    filePath = absFilePath(filePath);
    if (!window.monaco) return null;
    const uri = getUri(filePath);
    let model = monaco.editor.getModel(uri);
    if (!model && !noCreate) {
      model = monaco.editor.createModel(content || initialContent[filePath] || '', null, uri);
      model.updateOptions({ tabSize: 2 });
      console.log('model crated', filePath);
    }
    return model;
  },
  reset(filePath) {
    // Set the model content to initial values
    if (!filePath) return;
    filePath = absFilePath(filePath);
    // delete initialContent[filePath];
    const model = this.getModel(filePath, null, true);
    if (model && model.getValue() !== this.getInitialValue(filePath))
      model.setValue(this.getInitialValue(filePath) || '');
  },
  setValue(filePath, content) {
    filePath = absFilePath(filePath);
    const model = this.getModel(filePath);
    if (model && model.getValue() !== content) model.setValue(content);
  },
  setInitialValue(filePath, content, createModelIfNotExists) {
    filePath = absFilePath(filePath);
    if (initialContent[filePath] === content) return;
    const model = this.getModel(filePath, content, !createModelIfNotExists);
    if (
      model &&
      (!_.has(initialContent, filePath) || model.getValue() === initialContent[filePath])
    ) {
      initialContent[filePath] = content; // this line should be before model.setValue
      model.setValue(content);
    } else {
      initialContent[filePath] = content;
    }
  },
  getValue(filePath) {
    filePath = absFilePath(filePath);
    const model = this.getModel(filePath);
    if (model) return model.getValue();
    return null;
  },
  hasModel(filePath) {
    filePath = absFilePath(filePath);
    return !!this.getModel(filePath, null, true);
  },
  isChanged(filePath) {
    filePath = absFilePath(filePath);
    return (
      filePath &&
      _.has(initialContent, filePath) &&
      this.hasModel(filePath) &&
      initialContent[filePath] !== this.getValue(filePath)
    );
  },
  getInitialValue(filePath) {
    filePath = absFilePath(filePath);
    return initialContent[filePath] || null;
  },
  save(filePath) {
    filePath = absFilePath(filePath);
    initialContent[filePath] = this.getValue(filePath);
  },
};

export default modelManager;
