import React from 'react';
import { Modal, Button, Table } from 'semantic-ui-react';
import firebase from 'firebase/compat/app';
import { SubscribeButton } from '../SubscribeButton/SubscribeButton';

export class ScreenShareModal extends React.Component<{
  closeModal: () => void;
  startScreenShare: (useMediaSoup: boolean) => void;
  isSubscriber: boolean;
  user: firebase.User | undefined;
  beta?: boolean;
}> {
  render() {
    const { closeModal } = this.props;
    const subscribeButton = !this.props.isSubscriber ? (
      <SubscribeButton user={this.props.user} />
    ) : null;
    return (
      <Modal open={true} onClose={closeModal}>
        <Modal.Header>Share Your Screen</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <div>You're about to share your screen.</div>
            <ul>
              <li>This feature is only supported on Chrome and Edge.</li>
              <li>
                Audio sharing only works if sharing your entire screen or a
                browser tab, not an application.
              </li>
            </ul>
            <Table definition unstackable striped celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Watchparty</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>Method</Table.Cell>
                  <Table.Cell>
                    Stream your video to each viewer individually.
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Latency</Table.Cell>
                  <Table.Cell>{`< 1s`}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Recommended Max Viewers</Table.Cell>
                  <Table.Cell>5</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Recommended Upload Speed</Table.Cell>
                  <Table.Cell>5 Mbps per viewer</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() => {
                        this.props.startScreenShare(false);
                        this.props.closeModal();
                      }}
                    >
                      Start Screenshare
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    {this.props.isSubscriber ? (
                      <Button
                        color="orange"
                        onClick={() => {
                          this.props.startScreenShare(true);
                          this.props.closeModal();
                        }}
                      >
                        Start Screenshare w/Relay
                      </Button>
                    ) : (
                      ' '
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}
