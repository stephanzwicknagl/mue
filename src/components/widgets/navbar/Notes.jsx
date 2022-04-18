import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdContentCopy, MdAssignment, MdPushPin, MdDownload } from 'react-icons/md';
import { useFloating, shift } from '@floating-ui/react-dom';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { toast } from 'react-toastify';
import Tooltip from '../../helpers/tooltip/Tooltip';
//import Hotkeys from 'react-hot-keys';
import { saveFile } from 'modules/helpers/settings/modals';

class Notes extends PureComponent {
  constructor() {
    super();
    this.state = {
      notes: localStorage.getItem('notes') || '',
      visibility: localStorage.getItem('notesPinned') === 'true' ? 'visible' : 'hidden',
      showNotes: localStorage.getItem('notesPinned') === 'true' ? true : false,
    };
  }

  setNotes = (e) => {
    localStorage.setItem('notes', e.target.value);
    this.setState({
      notes: e.target.value,
    });
  };

  showNotes() {
    this.setState({
      showNotes: true,
    });
  }

  hideNotes() {
    if (localStorage.getItem('notesPinned') === 'true') {
      this.setState({
        showNotes: true,
      });
    } else {
      this.setState({
        showNotes: false,
      });
    }
  }

  pin() {
    variables.stats.postEvent('feature', 'Notes pin');
    if (localStorage.getItem('notesPinned') === 'true') {
      localStorage.setItem('notesPinned', false);
      this.setState({
        showNotes: false,
      });
    } else {
      localStorage.setItem('notesPinned', true);
      this.setState({
        showNotes: true,
      });
    }
  }

  copy() {
    variables.stats.postEvent('feature', 'Notes copied');
    navigator.clipboard.writeText(this.state.notes);
    toast(variables.language.getMessage(variables.languagecode, 'toasts.notes'));
  }

  download() {
    const notes = localStorage.getItem('notes');
    if (!notes || notes === '') {
      return;
    }

    variables.stats.postEvent('feature', 'Notes download');
    saveFile(this.state.notes, 'mue-notes.txt', 'text/plain');
  }

  render() {
    return (
      <div className="notes" onMouseLeave={() => this.hideNotes()} onFocus={() => this.showNotes()}>
        <button
          className="first"
          onMouseEnter={() => this.showNotes()}
          onFocus={() => this.showNotes()}
          onBlur={() => this.hideNotes()}
          ref={this.props.notesRef}
        >
          <MdAssignment className="topicons" />
        </button>
        {this.state.showNotes && (
          <span
            className="notesContainer"
            ref={this.props.floatRef}
            style={{
              position: this.props.position,
              top: this.props.yPosition ?? '44',
              left: this.props.xPosition ?? '',
            }}
          >
            <div className="flexNotes">
              <div className="topBarNotes" style={{ display: 'flex' }}>
                <MdAssignment />
                <span>
                  {variables.language.getMessage(
                    variables.languagecode,
                    'widgets.navbar.notes.title',
                  )}
                </span>
              </div>
              <div className="notes-buttons">
                <Tooltip title="Pin">
                  <button onClick={() => this.pin()}>
                    <MdPushPin />
                  </button>
                </Tooltip>
                <Tooltip title="Copy">
                  <button onClick={() => this.copy()}>
                    <MdContentCopy />
                  </button>
                </Tooltip>
                <Tooltip title="Download">
                  <button onClick={() => this.download()}>
                    <MdDownload />
                  </button>
                </Tooltip>
              </div>
              <TextareaAutosize
                placeholder={variables.language.getMessage(
                  variables.languagecode,
                  'widgets.navbar.notes.placeholder',
                )}
                value={this.state.notes}
                onChange={this.setNotes}
                minRows={5}
              />
              {/*variables.keybinds.pinNotes && variables.keybinds.pinNotes !== '' ? <Hotkeys keyName={variables.keybinds.pinNotes} onKeyDown={() => this.pin()}/> : null*/}
              {/*variables.keybinds.copyNotes && variables.keybinds.copyNotes !== '' ? <Hotkeys keyName={variables.keybinds.copyNotes} onKeyDown={() => this.copy()}/> : null*/}
            </div>
          </span>
        )}
      </div>
    );
  }
}

export default function NotesWrapper() {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom',
    middleware: [shift()],
  });

  return (
    <Notes
      notesRef={reference}
      floatRef={floating}
      position={strategy}
      xPosition={x}
      yPosition={y}
    />
  );
}
