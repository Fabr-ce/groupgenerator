import classNames from 'classnames';

interface ModalInput {
  open?: boolean;
  title: string;
  toggle: () => void;
  children: React.ReactNode;
}

export const Modal = ({ open, title, toggle, children }: ModalInput) => {
  return (
    <div
      className={classNames('modal cursor-pointer bg-black bg-opacity-70', {
        'modal-open': open,
      })}
      onClick={toggle}
    >
      {open && (
        <div
          className='modal-box relative bg-base-200 cursor-default'
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className='btn btn-sm btn-circle absolute right-2 top-2'
            onClick={toggle}
          >
            ✕
          </div>
          <h3 className='font-bold text-lg'>{title}</h3>
          {children}
        </div>
      )}
    </div>
  );
};

export const EditModal = ({
  open,
  toggle,
  title,
  name,
  changeName,
  submit,
}: {
  open: boolean;
  toggle: () => void;
  title: string;
  name: string;
  changeName: (a: string) => void;
  submit: (a: string) => void;
}) => {
  return (
    <Modal open={open} toggle={toggle} title={title}>
      <form>
        <div className='py-3'>
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => changeName(e.target.value)}
            className='input input-bordered w-full max-w-xs'
            autoFocus
          />
        </div>
        <div className='flex gap-4 w-full' onClick={toggle}>
          <button
            className='btn btn-primary flex-grow'
            type='submit'
            onClick={(e) => {
              e.preventDefault();
              submit(name);
            }}
          >
            Übernehmen
          </button>
          <button className='btn flex-grow' onClick={() => changeName(name)}>
            Abbrechen
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const DeleteModal = ({
  open,
  toggle,
  title,
  name,
  submit,
}: {
  open: boolean;
  toggle: () => void;
  title: string;
  name: string;
  submit: () => void;
}) => {
  return (
    <Modal open={open} toggle={toggle} title={title}>
      <div className='alert alert-warning shadow-lg my-3'>
        <div>
          {/*<svg
            xmlns='http://www.w3.org/2000/svg'
            className='stroke-current flex-shrink-0 h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>*/}
          <span className='overflow-hidden'>
            <>Willst du {name} für immer löschen?</>
          </span>
        </div>
      </div>
      <div className='flex gap-4 w-full' onClick={toggle}>
        <button className='btn btn-error flex-grow' onClick={submit}>
          Löschen
        </button>
        <button className='btn flex-grow'>Abbrechen</button>
      </div>
    </Modal>
  );
};
