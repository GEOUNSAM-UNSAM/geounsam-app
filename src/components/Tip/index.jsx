import { ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";

export default function Tip({
    children,
    icon,
    title,
    description,
    actionLabel,
    actionTo,
    onAction,
    actionIcon: ActionIcon = ArrowRight,
}) {
    const IconComponent = icon ?? Info;
    const hasStructuredContent = title || description || actionLabel;

    const actionClassName = "inline-flex items-center gap-1 font-faustina text-[16px] font-medium leading-6 text-action visited:text-action active:text-action";

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

        if (actionTo) {
            if (/^https?:\/\//i.test(actionTo)) {
                const target = new URL(actionTo);
                const sameOrigin = target.origin === window.location.origin;

                if (sameOrigin) {
                    return (
                        <div className="mt-2">
                            <Link
                                to={`${target.pathname}${target.search}${target.hash}`}
                                className={actionClassName}
                            >
                                {content}
                            </Link>
                        </div>
                    );
                }

                return (
                    <div className="mt-2">
                        <a href={actionTo} className={actionClassName}>
                            {content}
                        </a>
                    </div>
                );
            }

            return (
                <div className="mt-2">
                    <Link to={actionTo} className={actionClassName}>
                        {content}
                    </Link>
                </div>
            );
        }

        return (
            <div className="mt-2">
                <button
                    type="button"
                    onClick={onAction}
                    className={actionClassName}
                >
                    {content}
                </button>
            </div>
        );
    };

    return (
        <section className="flex items-start gap-3 rounded-[20px] border-2 border-action bg-state-blue px-4 py-4 text-neutral-extra-dark">
            <IconComponent
                size={20}
                className="mt-0.5 shrink-0 text-action"
            />
            {hasStructuredContent ? (
                <div className="min-w-0 flex-1">
                    {title ? (
                        <p className="font-saira text-base leading-6 text-neutral-extra-dark">
                            {title}
                        </p>
                    ) : null}
                    {description ? (
                        <p className="font-saira text-sm leading-4 text-neutral-extra-dark">
                            {description}
                        </p>
                    ) : null}
                    {children}
                    {renderAction()}
                </div>
            ) : (
                <p className="font-saira text-base leading-6 text-neutral-extra-dark">
                    {children}
                </p>
            )}
        </section>
    );
}
