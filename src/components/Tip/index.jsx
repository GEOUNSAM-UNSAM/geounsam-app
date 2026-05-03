import { ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const VARIANTS = {
  info: {
    container: 'border-2 border-action bg-state-blue p-4',
    icon: 'text-action',
    actionStyle: 'text',
  },
  tip: {
    container: 'bg-state-purple px-3 py-2',
    icon: 'text-state-dark',
    actionStyle: 'text',
  },
  success: {
    container: 'bg-data-green-200 px-3 py-2',
    icon: 'text-data-green-800',
    actionStyle: 'text',
  },
  warning: {
    container: 'border-2 border-data-orange-500 bg-state-yellow p-4',
    icon: 'text-data-orange-500',
    actionStyle: 'pill',
  },
  error: {
    container: 'border border-error bg-state-red px-4 py-3',
    icon: 'text-error',
    actionStyle: 'text',
  },
};

const TEXT_ACTION_CLASS =
  'inline-flex items-center gap-1 text-body-m-serif text-action';
const PILL_ACTION_CLASS =
  'inline-flex items-center gap-1 rounded-[10px] bg-data-orange-500 px-3 py-1.5 text-label-caption text-neutral-extra-dark';

export default function Tip({
  children,
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  actionIcon: ActionIcon = ArrowRight,
  variant = 'info',
}) {
  const IconComponent = icon ?? Info;
  const hasStructuredContent = title || description || actionLabel;
  const styles = VARIANTS[variant] ?? VARIANTS.info;
  const actionClassName =
    styles.actionStyle === 'pill' ? PILL_ACTION_CLASS : TEXT_ACTION_CLASS;

  const renderAction = () => {
    if (!actionLabel) return null;

    const content = (
      <>
        {actionLabel}
        {ActionIcon ? (
          <ActionIcon size={16} strokeWidth={2} aria-hidden="true" />
        ) : null}
      </>
    );

    const wrapClass = styles.actionStyle === 'pill' ? 'mt-1' : 'mt-2';

    if (actionTo) {
      if (/^https?:\/\//i.test(actionTo)) {
        const target = new URL(actionTo);
        const sameOrigin = target.origin === window.location.origin;

        return (
          <div className={wrapClass}>
            {sameOrigin ? (
              <Link
                to={`${target.pathname}${target.search}${target.hash}`}
                className={actionClassName}
              >
                {content}
              </Link>
            ) : (
              <a href={actionTo} className={actionClassName}>
                {content}
              </a>
            )}
          </div>
        );
      }

      return (
        <div className={wrapClass}>
          <Link to={actionTo} className={actionClassName}>
            {content}
          </Link>
        </div>
      );
    }

    return (
      <div className={wrapClass}>
        <button type="button" onClick={onAction} className={actionClassName}>
          {content}
        </button>
      </div>
    );
  };

  return (
    <section
      className={`flex items-start gap-2 rounded-[20px] text-neutral-extra-dark ${styles.container}`}
    >
      <IconComponent
        size={20}
        className={`mt-0.5 shrink-0 ${styles.icon}`}
        strokeWidth={2}
      />
      {hasStructuredContent ? (
        <div className="min-w-0 flex-1">
          {title ? (
            <p className="text-body-m text-neutral-extra-dark">{title}</p>
          ) : null}
          {description ? (
            <p className="text-body-s text-neutral-extra-dark">{description}</p>
          ) : null}
          {children}
          {renderAction()}
        </div>
      ) : (
        <p className="text-body-m text-neutral-extra-dark">{children}</p>
      )}
    </section>
  );
}
