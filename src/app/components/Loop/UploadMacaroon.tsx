import React from 'react';
import { Upload, Icon, Alert, Button, Form, Input } from 'antd';
import { blobToHex } from 'utils/file';
import { DEFAULT_LND_DIRS, NODE_TYPE } from 'utils/constants';
import './UploadMacaroons.less';

interface Props {
  error?: Error | null;
  isSaving?: boolean;
  initialLoop?: string;
  nodeType?: NODE_TYPE;
  onUploaded(loop: string): void;
}

interface State {
  loop: string;
  isShowingHexInputs: boolean;
  error: Error | null;
}

export default class UploadMacaroon extends React.Component<Props, State> {
  state: State = {
    loop: this.props.initialLoop || '',
    isShowingHexInputs: false,
    error: this.props.error || null,
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.error !== this.props.error) {
      this.setState({ error: this.props.error || null });
    }
  }

  render() {
    const { nodeType } = this.props;
    const { error, loop, isShowingHexInputs } = this.state;
    const dirs =
      (nodeType && DEFAULT_LND_DIRS[nodeType]) || DEFAULT_LND_DIRS[NODE_TYPE.LOCAL];
    return (
      <Form layout="vertical" className="UploadMacaroons">
        <div className="UploadMacaroons-description">
          We need to authenticate with your node using macaroons. Your admin macaroon will
          be encrypted, and payments will <em>never</em> be made without your explicit
          approval.
        </div>

        {isShowingHexInputs ? (
          <>
            <Form.Item label="Loop macaroon">
              <Input
                name="loop"
                value={loop}
                onChange={this.handleChangeMacaroonHex}
                placeholder="Paste hex string here"
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Upload.Dragger
              accept=".macaroon"
              showUploadList={false}
              beforeUpload={file => this.handleMacaroonUpload('loop', file)}
            >
              <p className="ant-upload-drag-icon">
                <Icon type={loop ? 'check-circle' : 'inbox'} />
              </p>
              <p className="ant-upload-text">
                Upload <code>loop.macaroon</code>
              </p>
              <p className="ant-upload-hint">Click or drag to upload macaroon</p>
            </Upload.Dragger>

            {dirs && (
              <div className="UploadMacaroons-hint">
                Macaroons are usually located in the following places
                <br />
                <strong>macOS</strong>: <code>{dirs.MACOS}</code>
                <br />
                <strong>Windows</strong>: <code>{dirs.WINDOWS}</code>
                <br />
                <strong>Linux</strong>: <code>{dirs.LINUX}</code>
              </div>
            )}
          </>
        )}

        <div className="UploadMacaroons-toggle">
          {isShowingHexInputs
            ? 'Have macaroon files instead?'
            : 'Have hex strings instead?'}{' '}
          <a onClick={this.toggleHexInputs}>Click here to switch</a>.
        </div>

        {error && (
          <Alert
            className="UploadMacaroons-error"
            message="Invalid macaroon"
            description={error.message}
            type="error"
            closable
            showIcon
          />
        )}

        <Button
          disabled={!loop}
          type="primary"
          onClick={this.handleSubmit}
          size="large"
          loading={this.props.isSaving}
          block
        >
          Continue
        </Button>
      </Form>
    );
  }

  private handleMacaroonUpload = (key: 'loop', file: File) => {
    this.setState({ error: null });
    if (file) {
      blobToHex(file)
        .then(hex => this.setState({ [key]: hex } as any))
        .catch(error => this.setState({ error }));
    }
    return false;
  };

  private handleChangeMacaroonHex = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [ev.target.name]: ev.target.value } as any);
  };

  private toggleHexInputs = () => {
    this.setState({ isShowingHexInputs: !this.state.isShowingHexInputs });
  };

  private handleSubmit = () => {
    this.props.onUploaded(this.state.loop);
  };
}
