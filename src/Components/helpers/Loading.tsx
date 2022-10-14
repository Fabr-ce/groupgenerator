import classNames from 'classnames';

export const Loading = ({ className }: { className?: string }) => {
  return (
    <div className='w-full flex align-middle justify-center'>
      <div
        className={classNames(
          'w-10 h-10 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin',
          className
        )}
      ></div>
    </div>
  );
};
