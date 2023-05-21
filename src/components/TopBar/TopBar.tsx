import React from 'react';
import { serverPath, colorMappings, getUserImage } from '../../utils';
import {
  Icon,
  Popup,
  Button,
  Dropdown,
  Image,
  SemanticSIZES,
} from 'semantic-ui-react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { LoginModal } from '../Modal/LoginModal';
import axios from 'axios';
import { SubscribeButton } from '../SubscribeButton/SubscribeButton';
import { ProfileModal } from '../Modal/ProfileModal';
import Announce from '../Announce/Announce';
import { InviteButton } from '../InviteButton/InviteButton';
import appStyles from '../App/App.module.css';

export async function createRoom(
  user: firebase.User | undefined,
  openNewTab: boolean | undefined,
  video: string = ''
) {
  const uid = user?.uid;
  const token = await user?.getIdToken();
  const response = await window.fetch(serverPath + '/createRoom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid,
      token,
      video,
    }),
  });
  const data = await response.json();
  const { name } = data;
  if (openNewTab) {
    window.open('/watch' + name);
  } else {
    window.location.assign('/watch' + name);
  }
}

export class NewRoomButton extends React.Component<{
  user: firebase.User | undefined;
  size?: SemanticSIZES;
  openNewTab?: boolean;
}> {
  createRoom = async () => {
    await createRoom(this.props.user, this.props.openNewTab);
  };
  render() {
    return (
      <Popup
        content="Create a new room with a random URL that you can share with friends"
        trigger={
          <Button
            color="blue"
            size={this.props.size}
            icon
            labelPosition="left"
            onClick={this.createRoom}
            className={this.props.size ? '' : 'toolButton'}
            fluid
          >
            <Icon name="certificate" />
            New Room
          </Button>
        }
      />
    );
  }
}

type SignInButtonProps = {
  user: firebase.User | undefined;
  fluid?: boolean;
  isSubscriber: boolean;
};

export class SignInButton extends React.Component<SignInButtonProps> {
  public state = { isLoginOpen: false, isProfileOpen: false, userImage: null };

  async componentDidUpdate(prevProps: SignInButtonProps) {
    if (!prevProps.user && this.props.user) {
      this.setState({ userImage: await getUserImage(this.props.user) });
    }
  }

  facebookSignIn = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  };

  googleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  };

  signOut = () => {
    firebase.auth().signOut();
    window.location.reload();
  };

  render() {
    if (this.props.user) {
      return (
        <div
          style={{
            margin: '4px',
            width: '100px',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <Image
            avatar
            src={this.state.userImage}
            onClick={() => this.setState({ isProfileOpen: true })}
          />
          {this.state.isProfileOpen && this.props.user && (
            <ProfileModal
              user={this.props.user}
              userImage={this.state.userImage}
              close={() => this.setState({ isProfileOpen: false })}
              isSubscriber={this.props.isSubscriber}
            />
          )}
        </div>
      );
    }
  }
}

export class ListRoomsButton extends React.Component<{
  user: firebase.User | undefined;
}> {
  public state = { rooms: [] as PersistentRoom[] };

  componentDidMount() {
    this.refreshRooms();
  }

  refreshRooms = async () => {
    if (this.props.user) {
      const token = await this.props.user.getIdToken();
      const response = await axios.get(
        serverPath + `/listRooms?uid=${this.props.user?.uid}&token=${token}`
      );
      this.setState({ rooms: response.data });
    }
  };

  deleteRoom = async (roomId: string) => {
    if (this.props.user) {
      const token = await this.props.user.getIdToken();
      await axios.delete(
        serverPath +
          `/deleteRoom?uid=${this.props.user?.uid}&token=${token}&roomId=${roomId}`
      );
      this.setState({
        rooms: this.state.rooms.filter((room) => room.roomId !== roomId),
      });
      this.refreshRooms();
    }
  };

  render() {
    return (
      <Dropdown
        style={{ height: '36px' }}
        icon="group"
        labeled
        className="icon"
        button
        text="My Rooms"
        onClick={this.refreshRooms}
        scrolling
        pointing="top right"
      >
        <Dropdown.Menu>
          {this.state.rooms.length === 0 && (
            <Dropdown.Item disabled>You have no permanent rooms.</Dropdown.Item>
          )}
          {this.state.rooms.map((room: any) => {
            return (
              <Dropdown.Item
                key={room.roomId}
                link="true"
                href={
                  room.vanity ? '/r/' + room.vanity : '/watch' + room.roomId
                }
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {room.vanity ? `/r/${room.vanity}` : room.roomId}
                  <div style={{ marginLeft: 'auto', paddingLeft: '20px' }}>
                    <Button
                      icon
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        e.preventDefault();
                        this.deleteRoom(room.roomId);
                      }}
                      color="red"
                      size="mini"
                    >
                      <Icon name="trash" />
                    </Button>
                  </div>
                </div>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export class TopBar extends React.Component<{
  user?: firebase.User;
  hideNewRoom?: boolean;
  hideSignin?: boolean;
  hideMyRooms?: boolean;
  isSubscriber: boolean;
  roomTitle?: string;
  roomDescription?: string;
  roomTitleColor?: string;
  showInviteButton?: boolean;
}> {
  render() {
    // const subscribeButton = !this.props.isSubscriber ? (
    //   <SubscribeButton user={this.props.user} />
    // ) : null;
    return (
      <React.Fragment>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            padding: '1em',
            paddingBottom: '0px',
            rowGap: '8px',
          }}
        >
          <a href="/" style={{ display: 'flex' }}>
            <div
              style={{
                height: '48px',
                width: '48px',
                marginRight: '10px',
                borderRadius: '50%',
                position: 'relative',
                backgroundColor: '#' + colorMappings.blue,
              }}
            >
              <Icon
                inverted
                name="film"
                size="large"
                style={{
                  position: 'absolute',
                  top: 8,
                  width: '100%',
                  margin: '0 auto',
                }}
              />
              <Icon
                inverted
                name="group"
                size="large"
                color="green"
                style={{
                  position: 'absolute',
                  bottom: 8,
                  width: '100%',
                  margin: '0 auto',
                }}
              />
            </div>
          </a>
          {this.props.roomTitle || this.props.roomDescription ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginRight: 10,
                marginLeft: 10,
              }}
            >
              <div
                style={{
                  fontSize: 30,
                  color: this.props.roomTitleColor || 'white',
                  fontWeight: 'bold',
                  letterSpacing: 1,
                }}
              >
                {this.props.roomTitle?.toUpperCase()}
              </div>
              <div style={{ marginTop: 4, color: 'rgb(255 255 255 / 63%)' }}>
                {this.props.roomDescription}
              </div>
            </div>
          ) : (
            <React.Fragment>
              <a href="/" style={{ display: 'flex' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: '#2185d0',
                      fontSize: '30px',
                      lineHeight: '30px',
                    }}
                  >
                    THETA
                  </div>
                  <div
                    style={{
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: '#21ba45',
                      fontSize: '30px',
                      lineHeight: '30px',
                      marginLeft: 'auto',
                    }}
                  >
                    WATCHPARTY-AR
                  </div>
                </div>
              </a>
            </React.Fragment>
          )}
          <div
            style={{
              display: 'flex',
              marginLeft: '10px',
              alignItems: 'center',
            }}
          ></div>
          <Announce />
          <div
            className={appStyles.mobileStack}
            style={{
              display: 'flex',
              marginLeft: 'auto',
              gap: '4px',
            }}
          >
            {this.props.showInviteButton && <InviteButton />}
            {!this.props.hideNewRoom && (
              <NewRoomButton user={this.props.user} openNewTab />
            )}
            {!this.props.hideMyRooms && this.props.user && (
              <ListRoomsButton user={this.props.user} />
            )}
            {/* {subscribeButton} */}
            {!this.props.hideSignin && (
              <SignInButton
                user={this.props.user}
                isSubscriber={this.props.isSubscriber}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
