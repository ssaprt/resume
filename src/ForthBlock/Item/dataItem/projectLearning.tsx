import { DynamicSvgIcon } from "../../../components/Icons/DynamicSvgIcon";
import { Block } from "../ModalContent/Block";
import { devTools } from "./devTools";
import { GraphDiagram, type Edge } from "./GraphDiagram";

const edgesTwoPeters: Edge[] = [
    {
        from: "root",
        to: "root-a",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-a",
        to: "root-b",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-b",
        to: "root-c",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-c",
        to: "root-d",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-d",
        to: "level-1-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-1-a",
        to: "level-2-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-a",
        to: "level-2-b",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-a",
        fromSide: "bottom",
        toSide: "right",
        to: "level-5-b",
        type: "rounded",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-5-b",
        fromSide: "left",
        toSide: "right",
        to: "level-4-a",
        type: "rounded",
        radius: 16,
        bendAt: 0.85,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-4-a",
        fromSide: "left",
        toSide: "bottom",
        to: "level-1-c",
        type: "rounded",
        radius: 16,
        bendAt: 0.85,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-1-c",
        to: "level-1-b",
        type: "rounded",
        radius: 16,
        fromSide: "top",
        toSide: "bottom",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-b",
        to: "level-2-c",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-c",
        to: "level-3-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-c",
        to: "level-2-d",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-1-d",
        to: "level-2-c",
        type: "rounded",
        radius: 16,
        fromSide: "left",
        toSide: "top",
        offset: 6,
        width: 1,
        dash: "2,2",
    },

    {
        from: "level-2-d",
        to: "level-4-a",
        type: "rounded",
        fromSide: "left",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-3-a",
        to: "level-4-b",
        type: "straight",
        fromSide: "bottom",
        toSide: "top",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-3-a",
        to: "level-4-c",
        type: "rounded",
        fromSide: "right",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-4-a",
        to: "level-5-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "2,2",
    },
    {
        from: "level-5-a",
        to: "level-6-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "2,2",
    },
    {
        from: "level-5-b",
        to: "level-6-b",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "2,2",
    },
];

const edgesUtilityLab: Edge[] = [
    {
        from: "root",
        to: "root-a",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-a",
        to: "root-b",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-b",
        to: "root-c",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-c",
        to: "root-d",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-d",
        to: "level-1-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-1-a",
        to: "level-2-a",
        type: "rounded",
        fromSide: "bottom",
        toSide: "right",
        radius: 16,
        bendAt: 1,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-a",
        to: "level-2-b",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-a",
        to: "level-5-b",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "2,2",
    },

    {
        from: "level-4-a",
        fromSide: "left",
        toSide: "bottom",
        to: "level-1-c",
        type: "rounded",
        radius: 16,
        bendAt: 0.85,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-3-a",
        fromSide: "left",
        toSide: "right",
        to: "level-6-a",
        type: "curve",
        offset: 6,
        width: 1,
        dash: "2,2",
    },
    {
        from: "level-1-c",
        to: "level-1-b",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-b",
        to: "level-2-c",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-b",
        to: "level-2-d",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-b",
        to: "level-3-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-c",
        to: "level-3-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-c",
        to: "level-2-d",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-d",
        to: "level-4-a",
        type: "straight",

        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-3-a",
        to: "level-4-b",
        type: "straight",
        fromSide: "bottom",
        toSide: "top",
        offset: 6,
        width: 1,
        dash: "0,0",
    },

    {
        from: "level-4-a",
        to: "level-5-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "2,2",
    },
    {
        from: "level-5-a",
        to: "level-6-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "2,2",
    },
];

const edgesTwoPetersPanel: Edge[] = [
    {
        from: "root",
        to: "root-a",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-a",
        to: "root-b",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-b",
        to: "root-d",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-c",
        to: "root-d",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-c",
        to: "level-1-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-1-a",
        to: "level-2-a",
        type: "rounded",
        fromSide: "left",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-1-a",
        to: "level-2-b",
        type: "rounded",
        fromSide: "right",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },

    {
        from: "level-2-a",
        to: "level-3-a",
        type: "rounded",
        fromSide: "left",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-a",
        to: "level-3-b",
        type: "rounded",
        fromSide: "bottom",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-a",
        to: "level-3-c",
        type: "rounded",
        fromSide: "right",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-b",
        to: "level-3-d",
        type: "rounded",
        fromSide: "right",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "2,2",
    },
    {
        from: "level-3-d",
        to: "level-4-a",
        type: "rounded",
        fromSide: "bottom",
        toSide: "right",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "2,2",
    },
];

export const edgesRadioDock: Edge[] = [
    {
        from: "root",
        to: "root-a",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-a",
        to: "root-b",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-b",
        to: "root-c",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-c",
        to: "level-1-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "2,2",
    },
    {
        from: "level-1-a",
        to: "level-2-a",
        type: "rounded",
        fromSide: "bottom",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-a",
        to: "level-3-a",
        type: "rounded",
        fromSide: "left",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-a",
        to: "level-3-b",
        type: "rounded",
        fromSide: "right",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "2,2",
    },
];

export const edgesGmoon: Edge[] = [
    {
        from: "root",
        to: "root-a",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-a",
        to: "level-1-a",
        type: "rounded",
        fromSide: "bottom",
        toSide: "right",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "2,2",
    },
    {
        from: "level-1-a",
        to: "level-2-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-a",
        to: "level-3-a",
        type: "rounded",
        fromSide: "left",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-a",
        to: "level-3-b",
        type: "rounded",
        fromSide: "right",
        toSide: "top",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "0,0",
    },
];

export const edgesCrm: Edge[] = [
    {
        from: "root",
        to: "root-a",
        type: "straight",
        offset: 12,
        width: 1,
        dash: "2,2",
    },
    {
        from: "root-a",
        to: "level-1-a",
        type: "rounded",
        fromSide: "bottom",
        toSide: "right",
        radius: 16,
        offset: 6,
        width: 1,
        dash: "2,2",
    },
    {
        from: "level-1-a",
        to: "level-2-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-2-a",
        to: "level-3-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
    {
        from: "level-3-a",
        to: "level-4-a",
        type: "straight",
        offset: 6,
        width: 1,
        dash: "0,0",
    },
];

export const learningProject = {
    learningTwoPeters: [
        `The core concept for this project originated with a pair of
                        brothers involved in the wine business. They needed a
                        "calling card"—a signature representation of their work. I
                        helped them bring their ideas to life, focusing on
                        developing their brand, showcasing their products, and
                        positioning them to enter a larger market alongside other
                        key players in their industry.`,
        'The ultimate goal was to independently develop a plan to execute a well-defined set of technical requirements, as the client had no clear idea of ​​what they wanted to see. The task involved building an ideal product tailored to the business`s specific needs. To achieve this, it was necessary to visit the brothers" winery and engage in ongoing discussions to understand the inner workings of their business.',
        "Analysis and research have highlighted the need to establish a dedicated service for engaging with both prospective and existing partners, as well as to develop a direct corporate presence, a tourism division, and a program of major events—including their organization—alongside the independent sale of products in the marketplace.",

        <>
            <span>
                An action plan was developed, which includes the implementation
                of the part of the project intended for a broad audience — a
                website
            </span>

            <div className="col-start-1 mt-2">
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">Loyalty program</p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">Tours and excursions</p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Product sales locations
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        System of events (internal and partner-related)
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Review manager, with or without authorization, tied to
                        each of the aforementioned patterns
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        A shopping cart integrated with loyalty programs,
                        events, addresses, product availability, affiliate
                        programs, and domestic service providers
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        The visual component — which can be altered by
                        approximately 90% using accompanying tools within a CRM
                        system specifically designed for this project
                    </p>
                </div>
            </div>
        </>,
        <>
            <div className="col-start-1">
                <span>
                    The choice of technologies was driven primarily by SEO
                    considerations. To ensure the platform achieves high
                    rankings in search engine results, we opted for Next.js,
                    utilizing various HTML generation methods—specifically SSR
                    (Server-Side Rendering), ISR (Incremental Static
                    Regeneration), and PPR (Partial Prerendering). The full
                    stack of technologies used is also presented below
                </span>
                <div className="row-center-1 flex-wrap mt-2">
                    {devTools.twoPeters.map((tool, i) => (
                        <p
                            className="py-1 px-2 rounded-[12px] border-1 border-current/30 text-[12px]!"
                            key={i}
                        >
                            {tool}
                        </p>
                    ))}
                </div>
            </div>
        </>,
        `The design was partially derived from an existing logo. The missing elements were developed throughout the entire design process without the involvement of a professional designer.`,
        `Development proceeded according to a previously prepared plan. With all the necessary functionality already available, implementing the required platform management components was straightforward. We developed managers for various patterns, including an event manager, a geo-presence manager, a reviews manager, a manager for handling branches and retail locations, a tour manager, a shopping cart manager, a user-agent handler, and other functional components.`,
        <div>
            <span>The testing was divided into 3 stages:</span>
            <div className="col-start-1 mt-2">
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Testing UI/UX components, responsiveness, and
                        application performance across different devices under
                        varying workloads
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Testing application security, including malicious code
                        injection through forms, shopping carts, review
                        management systems, and loyalty programs. Verifying
                        secure authorization token storage, access control,
                        input validation, and protection against application
                        abuse
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Testing end-to-end business workflows and integration
                        between application modules, including user
                        authentication, product purchasing, order processing,
                        loyalty programs, review management, and CRM data
                        synchronization. Verifying data consistency, error
                        handling, and the correct behavior of dependent systems
                        throughout the entire workflow
                    </p>
                </Block>
            </div>
        </div>,
        <div className="col-start-3">
            The implementation stage focused on establishing a complete
            deployment workflow and preparing the production infrastructure. An
            Ubuntu server was configured to host the application, backend, and
            database within a Docker-based environment. A CI/CD pipeline was
            integrated to connect ongoing development with automated builds and
            deployments, reducing the need for manual intervention during
            releases. Deployment failure notifications were configured to
            provide timely feedback on unsuccessful releases, while rollback
            mechanisms were implemented to restore the last stable version when
            necessary. The resulting infrastructure established a consistent and
            maintainable process for deploying updates and keeping the
            application operational
            <GraphDiagram edges={edgesTwoPeters} className="col-stretch-14">
                <div className="row-center-2 justify-between w-full">
                    <DynamicSvgIcon
                        name="dev"
                        data-tree-node="root"
                        className="size-8 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="trans"
                        data-tree-node="root-a"
                        className="size-4 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="github"
                        data-tree-node="root-b"
                        className="size-8 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="trans"
                        data-tree-node="root-c"
                        className="size-4 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="server"
                        data-tree-node="root-d"
                        className="size-8 fill-curr"
                    />
                </div>
                <div className="w-full row-center-1 justify-between mt-8">
                    <span
                        className="text-[12px]! text-curr! px-3 py-2 rounded-md border-1"
                        data-tree-node="level-1-b"
                    >
                        latest working release
                    </span>
                    <DynamicSvgIcon
                        name="telegram"
                        data-tree-node="level-1-d"
                        className="size-8 fill-curr"
                    />

                    <div className="size-6" />

                    <DynamicSvgIcon
                        name="message_exchange"
                        data-tree-node="level-1-a"
                        className="size-4 fill-curr mr-2"
                    />
                </div>
                <div className="row-center-2 justify-between w-full mt-8">
                    <DynamicSvgIcon
                        name="replace"
                        data-tree-node="level-1-c"
                        className="size-4 fill-curr ml-4"
                    />
                    <DynamicSvgIcon
                        name="message_exchange"
                        data-tree-node="level-2-d"
                        className="size-4 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="nginx"
                        data-tree-node="level-2-c"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="message_exchange"
                        data-tree-node="level-2-b"
                        className="size-4 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="docker"
                        data-tree-node="level-2-a"
                        className="size-8 fill-curr"
                    />
                </div>

                <DynamicSvgIcon
                    name="message_exchange"
                    data-tree-node="level-3-a"
                    className="size-4 fill-curr mt-8 mx-auto"
                />

                <div className="row-center-1 w-full justify-around mt-8">
                    <DynamicSvgIcon
                        name="next"
                        data-tree-node="level-4-a"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="database"
                        data-tree-node="level-4-b"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="2"
                        data-tree-node="level-4-c"
                        className="size-8 fill-curr"
                    />
                </div>

                <div className="row-center-2 w-full justify-around mt-8">
                    <DynamicSvgIcon
                        name="trans"
                        data-tree-node="level-5-a"
                        className="size-4 fill-curr ml-2"
                    />
                    <div className="size-8" />
                    <DynamicSvgIcon
                        name="crash"
                        data-tree-node="level-5-b"
                        className="size-8 fill-curr"
                    />
                </div>

                <div className="row-center-2 w-full justify-around mt-8">
                    <DynamicSvgIcon
                        name="monitor"
                        data-tree-node="level-6-a"
                        className="size-8 fill-curr"
                    />
                    <div className="size-6" />
                    <DynamicSvgIcon
                        name="notification"
                        data-tree-node="level-6-b"
                        className="size-8 fill-curr"
                    />
                </div>
            </GraphDiagram>
        </div>,
        `At present, the service is fully operational, with both the frontend and backend components functioning as intended. Since the initial official release, over 1,000 unique content items have been created, sales exceeding $400,000 have been generated, and more than 30 third-party API services have been integrated with minimal developer intervention. Furthermore, over 48 points of sale have been established, and the platform has been featured in more than 38 events. The number of users who arrived via search engines alone—from the time of release to the present—stands at 128,417 (a figure updated in real time via API)`,
    ],
    learningUtilityLab: [
        `The idea for this project came about when I kept encountering a multitude of services where tools for generating various types of web development content were scattered across different platforms. I wanted to create a project that would address all those needs in one single place.`,
        "To achieve the creation of a platform where up-to-date data is always maintained, thanks to dynamic content generation.",
        "After analyzing existing platforms that provide users with information about various web development technologies, I discovered that most of the data is static and updated manually, which means the information can easily become outdated.",

        <>
            <span>An action plan was drawn up, which includes</span>

            <div className="col-start-1 mt-2">
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Implementation of the structure
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Implementation of a universal data processing tool for
                        server-side and client-side use
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Finding the right approach for generating content when a
                        page loads, while avoiding static routes and a lot of
                        boilerplate code
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        The desire to bring everything into a unified style, to
                        facilitate the future integration of new functionality
                        without the need to build a separate pipeline from
                        scratch
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Implement a client-side controller that gathers concise
                        information according to a specific pattern and sends it
                        to the server for processing by an AI agent. The goal is
                        to minimize the number of tokens per request.
                    </p>
                </div>
            </div>
        </>,
        <>
            <div className="col-start-1">
                <span>
                    The choice of technologies was based, first and foremost, on
                    a division between the server-side and client-side
                    components. On the client side, I aimed to implement fully
                    dynamic content generation, combined with rigorous cache
                    management—this would minimize network load while ensuring
                    that any loaded content remained up-to-date whenever changes
                    occurred. On the server side, I implemented a robust,
                    large-scale controller that processes batches of requests
                    from a library of sources; this ensures that the client
                    always receives up-to-date information, with comparisons
                    performed across more than 30 criteria.
                </span>
                <div className="row-center-1 flex-wrap mt-2">
                    {devTools.utilityLab.map((tool, i) => (
                        <p
                            className="py-1 px-2 rounded-[12px] border-1 border-current/30 text-[12px]!"
                            key={i}
                        >
                            {tool}
                        </p>
                    ))}
                </div>
            </div>
        </>,
        `A minimalist design was chosen, with the option to switch themes using any color combination`,
        `Development was carried out in accordance with a pre-prepared plan. Since all the necessary functionality was already in place, implementing the required components for managing the platform proved straightforward. We developed management modules for various tasks, including both server-side and client-side agents.`,
        <div>
            <span>The testing was divided into 3 stages:</span>
            <div className="col-start-1 mt-2">
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Testing UI/UX components, responsiveness, and
                        application performance across different devices under
                        varying workloads
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Verification of the entire API pipeline operations
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Testing the operation of a controller interacting with
                        an AI agent, evaluating the quality of responses, and
                        assessing costs
                    </p>
                </Block>
            </div>
        </div>,
        <div className="col-start-3">
            The implementation stage focused on establishing a complete
            deployment workflow and preparing the production infrastructure. An
            Ubuntu server was configured to host the application, backend, and
            database within a Docker-based environment. A CI/CD pipeline was
            integrated to connect ongoing development with automated builds and
            deployments, reducing the need for manual intervention during
            releases. Deployment failure notifications were configured to
            provide timely feedback on unsuccessful releases, while rollback
            mechanisms were implemented to restore the last stable version when
            necessary. The resulting infrastructure established a consistent and
            maintainable process for deploying updates and keeping the
            application operational
            <GraphDiagram edges={edgesUtilityLab} className="col-stretch-14">
                <div className="row-center-2 justify-between w-full">
                    <DynamicSvgIcon
                        name="dev"
                        data-tree-node="root"
                        className="size-8 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="trans"
                        data-tree-node="root-a"
                        className="size-4 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="github"
                        data-tree-node="root-b"
                        className="size-8 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="trans"
                        data-tree-node="root-c"
                        className="size-4 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="vercel"
                        data-tree-node="root-d"
                        className="size-8 fill-curr"
                    />
                </div>
                <div className="w-full row-center-1 justify-between mt-8">
                    <DynamicSvgIcon
                        name="replace"
                        data-tree-node="level-1-c"
                        className="size-4 fill-curr ml-2"
                    />
                    <div className="size-8" />
                    <div className="size-4" />
                    <span
                        className="text-[12px]! text-curr! px-3 py-2 rounded-md border-1"
                        data-tree-node="level-1-b"
                    >
                        latest working release
                    </span>
                    <DynamicSvgIcon
                        name="message_exchange"
                        data-tree-node="level-1-a"
                        className="size-4 fill-curr mr-2"
                    />
                </div>
                <div className="row-center-2 justify-around w-full mt-8">
                    <DynamicSvgIcon
                        name="message_exchange"
                        data-tree-node="level-2-d"
                        className="size-4 fill-curr ml-2"
                    />

                    <DynamicSvgIcon
                        name="nestjs"
                        data-tree-node="level-2-b"
                        className="size-8 fill-curr ml-2"
                    />
                    <DynamicSvgIcon
                        name="crash"
                        data-tree-node="level-2-a"
                        className="size-8 fill-curr"
                    />
                </div>

                <DynamicSvgIcon
                    name="message_exchange"
                    data-tree-node="level-3-a"
                    className="size-4 fill-curr mt-8 mx-auto"
                />

                <div className="row-center-1 w-full justify-around mt-8">
                    <DynamicSvgIcon
                        name="next"
                        data-tree-node="level-4-a"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="database"
                        data-tree-node="level-4-b"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="notification"
                        data-tree-node="level-5-b"
                        className="size-8 fill-curr"
                    />
                </div>

                <div className="row-center-2 w-full justify-around mt-8">
                    <DynamicSvgIcon
                        name="trans"
                        data-tree-node="level-5-a"
                        className="size-4 fill-curr ml-2"
                    />
                    <div className="size-8" />
                    <div className="size-8" />
                </div>

                <div className="row-center-2 w-full justify-around mt-8">
                    <DynamicSvgIcon
                        name="monitor"
                        data-tree-node="level-6-a"
                        className="size-8 fill-curr"
                    />
                    <div className="size-6" />
                    <div className="size-8" />
                </div>
            </GraphDiagram>
        </div>,
        `All the planned ideas have been successfully implemented. The platform is currently thriving and is constantly being expanded with new tools. As of now, it includes React and Next.js libraries, over 40 generators, and more than 120 utilities for web development tasks.`,
    ],
    learningTwoPetersPanel: [
        `The concept was already clear. In parallel with the client-facing side, it was necessary to develop a CRM system that would handle both content management and the business-related aspects of the project.`,
        `The ultimate goal was to bring all the previously conceived ideas to life. The vision was a finished product with comprehensive functionality for managing personnel, products, orders, addresses, tours, events, and reviews, as well as handling 3D product displays.`,
        "When analyzing the feasibility of integrating third-party business tools, it became clear that achieving the desired final product would be difficult. Consequently, it was decided to develop all the functionality—including the authorization system—from scratch",

        <>
            <span>
                An action plan was developed, which includes the implementation
                of the part of the project designed for business management
            </span>

            <div className="col-start-1 mt-2">
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">Loyalty program</p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">Tours and excursions</p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Product sales locations
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        System of events (internal and partner-related)
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Review manager, with or without authorization, tied to
                        each of the aforementioned patterns
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        A shopping cart integrated with loyalty programs,
                        events, addresses, product availability, affiliate
                        programs, and domestic service providers
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        A client-side application builder for modifying over 90%
                        of the visual content.
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">Authorization Manager</p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        A controller that links various types of dynamic
                        content—such as addresses, product availability,
                        reviews, events, tours, discount schemes, and loyalty
                        programs—to one another.
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Development of a 3D product card builder that can be
                        used for new product arrivals without requiring the
                        involvement of a developer
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">Error logging system</p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Change notification system
                    </p>
                </div>
            </div>
        </>,
        <>
            <div className="col-start-1">
                <span>
                    The choice of technology was driven primarily by the need to
                    ensure fast performance and facilitate the creation of SPA
                    applications
                </span>
                <div className="row-center-1 flex-wrap mt-2">
                    {devTools.twoPetersPanel.map((tool, i) => (
                        <p
                            className="py-1 px-2 rounded-[12px] border-1 border-current/30 text-[12px]!"
                            key={i}
                        >
                            {tool}
                        </p>
                    ))}
                </div>
            </div>
        </>,
        `The design was partially derived from an existing logo. The missing elements were developed throughout the entire design process without the involvement of a professional designer.`,
        `Development proceeded according to a previously prepared plan. With all the necessary functionality already available, implementing the required platform management components was straightforward. We developed managers for various patterns, including an event manager, a geo-presence manager, a reviews manager, a manager for handling branches and retail locations, a tour manager, a shopping cart manager, a user-agent handler, and other functional components.`,
        <div>
            <span>The testing was divided into 3 stages:</span>
            <div className="col-start-1 mt-2">
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Testing UI/UX components, responsiveness, and
                        application performance across different devices under
                        varying workloads
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Testing application security, including malicious code
                        injection through forms, shopping carts, review
                        management systems, and loyalty programs. Verifying
                        secure authorization token storage, access control,
                        input validation, and protection against application
                        abuse
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Testing end-to-end business workflows and integration
                        between application modules, including user
                        authentication, product purchasing, order processing,
                        loyalty programs, review management, and CRM data
                        synchronization. Verifying data consistency, error
                        handling, and the correct behavior of dependent systems
                        throughout the entire workflow
                    </p>
                </Block>
            </div>
        </div>,
        <div className="col-start-3">
            The implementation stage focused on establishing a complete
            deployment workflow and preparing the production infrastructure. An
            Ubuntu server was configured to host the application, backend, and
            database within a Docker-based environment. A CI/CD pipeline was
            integrated to connect ongoing development with automated builds and
            deployments, reducing the need for manual intervention during
            releases. Deployment failure notifications were configured to
            provide timely feedback on unsuccessful releases, while rollback
            mechanisms were implemented to restore the last stable version when
            necessary. The resulting infrastructure established a consistent and
            maintainable process for deploying updates and keeping the
            application operational
            <GraphDiagram edges={edgesTwoPetersPanel} className="col-stretch-1">
                <div className="grid grid-cols-6 grid-rows-2 mt-10 w-full place-items-center gap-8">
                    <DynamicSvgIcon
                        name="dev"
                        data-tree-node="root"
                        className="col-start-1 col-span-2 row-start-1 size-8 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="trans"
                        data-tree-node="root-a"
                        className="col-start-3 col-span-2 row-start-1 size-4 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="github"
                        data-tree-node="root-b"
                        className="col-start-5 col-span-2 row-start-1 size-8 fill-curr"
                    />

                    <div className="col-start-1 col-span-2 row-start-2 size-8" />

                    <DynamicSvgIcon
                        name="server"
                        data-tree-node="root-c"
                        className="col-start-3 col-span-2 row-start-2 size-8 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="trans"
                        data-tree-node="root-d"
                        className="col-start-5 col-span-2 row-start-2 size-4 fill-curr"
                    />
                </div>

                <DynamicSvgIcon
                    name="message_exchange"
                    data-tree-node="level-1-a"
                    className="col-start-3 col-span-2 row-start-1 size-4 fill-curr mx-auto mt-8"
                />

                <div className="row-center-1 justify-around mt-8 w-full">
                    <DynamicSvgIcon
                        name="docker"
                        data-tree-node="level-2-a"
                        className="col-start-1 col-span-2 row-start-1 size-8 fill-curr"
                    />

                    <DynamicSvgIcon
                        name="4"
                        data-tree-node="level-2-b"
                        className="col-start-1 col-span-2 row-start-1 size-8 fill-curr"
                    />
                </div>

                <div className="row-center-2 justify-around mt-8 w-full">
                    <DynamicSvgIcon
                        name="nginx"
                        data-tree-node="level-3-a"
                        className="col-start-1 col-span-2 row-start-1 size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="database"
                        data-tree-node="level-3-b"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="2"
                        data-tree-node="level-3-c"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="message_exchange"
                        data-tree-node="level-3-d"
                        className="size-4 fill-curr"
                    />
                </div>

                <DynamicSvgIcon
                    name="monitor"
                    data-tree-node="level-4-a"
                    className="size-8 fill-curr mt-8 mx-auto"
                />
            </GraphDiagram>
        </div>,
        `At present, the service is fully operational, with both the frontend and backend components functioning as intended. Since the initial official release, over 1,000 unique content items have been created, sales exceeding $400,000 have been generated, and more than 30 third-party API services have been integrated with minimal developer intervention. Furthermore, over 48 points of sale have been established, and the platform has been featured in more than 38 events. The number of users who arrived via search engines alone—from the time of release to the present—stands at 128,417 (a figure updated in real time via API)`,
    ],
    learningRadioDock: [
        `The concept for this project arose from the need for a universally embeddable, lightweight radio module. The goal was to create a highly modular component that could be seamlessly integrated into various web environments without conflicting with existing architectures, providing access to a massive global directory of stations.`,
        "The primary challenge was managing asynchronous streams, aggregating metadata from over 50,000 radio stations, and presenting it through a customizable, high-performance UI.",
        "Analysis of existing solutions revealed a lack of flexible, developer-friendly radio widgets that offer deep filtering capabilities (by codec, bitrate, genre, and country) out of the box.",
        <>
            <span>An action plan was drawn up, which includes:</span>
            <div className="col-start-1 mt-2">
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Implementation of a modular UI adaptable to various
                        themes
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Integration with a custom API aggregating 50,000+
                        stations
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Advanced filtering logic for bitrate, codec, and
                        geography
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Real-time metadata extraction for track, artist, and
                        album details
                    </p>
                </div>
            </div>
        </>,
        <>
            <div className="col-start-1">
                <span>
                    React and Tailwind were chosen for the frontend to ensure
                    maximum modularity and ease of styling. The backend
                    operations and API caching were handled via Nest.js to
                    maintain a scalable, reliable connection to the upstream
                    radio station directories.
                </span>
                <div className="row-center-1 flex-wrap mt-2">
                    {devTools.radioDock.map((tool, i) => (
                        <p
                            className="py-1 px-2 rounded-[12px] border-1 border-current/30 text-[12px]!"
                            key={i}
                        >
                            {tool}
                        </p>
                    ))}
                </div>
            </div>
        </>,
        `The design focused on an intuitive dock-like interface that can float or be embedded, prioritizing minimal footprint and user accessibility.`,
        `Development involved strict separation of concerns, isolating the audio processing logic from the UI components to ensure smooth playback across browser state changes.`,
        <div>
            <span>The testing was divided into 3 stages:</span>
            <div className="col-start-1 mt-2">
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Cross-browser audio stream reliability and fallback
                        testing
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Testing the API aggregator under heavy filtering queries
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        UI/UX testing for responsiveness in embedded
                        environments
                    </p>
                </Block>
            </div>
        </div>,
        <div className="col-start-3">
            The module was deployed using Dockerized Nest.js for the API layer
            and Vercel for the client-side SPA. CI/CD pipelines were configured
            to ensure seamless updates to the aggregator logic without
            interrupting active streams.
            <GraphDiagram edges={edgesRadioDock} className="col-stretch-14">
                <div className="row-center-2 justify-between w-full mt-4">
                    <DynamicSvgIcon
                        name="dev"
                        data-tree-node="root"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="trans"
                        data-tree-node="root-a"
                        className="size-4 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="github"
                        data-tree-node="root-b"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="trans"
                        data-tree-node="root-c"
                        className="size-4 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="vercel"
                        data-tree-node="level-1-a"
                        className="size-8 fill-curr"
                    />
                </div>
                <div className="row-center-1 w-full justify-center mt-8">
                    <DynamicSvgIcon
                        name="nestjs"
                        data-tree-node="level-2-a"
                        className="size-8 fill-curr"
                    />
                </div>
                <div className="row-center-2 w-full justify-around mt-8">
                    <DynamicSvgIcon
                        name="database"
                        data-tree-node="level-3-a"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="monitor"
                        data-tree-node="level-3-b"
                        className="size-8 fill-curr"
                    />
                </div>
            </GraphDiagram>
        </div>,
        `The radio module is currently deployed across multiple active projects, flawlessly serving global streams with a zero-configuration integration process for end developers.`,
    ],

    learningGmoon: [
        `This project was built from the ground up to foster a vibrant, interactive community around a specialized store, intentionally avoiding modern JavaScript frameworks to achieve a purely custom, lightweight Vanilla JS and PHP architecture.`,
        "The core objective was to blend e-commerce with rich social features—like real-time chat, detailed user profiles, and achievement systems—without relying on React, Vue, or modern bundlers.",
        "Developing complex state management and real-time features using only jQuery and Vanilla JS presented unique architectural challenges, requiring custom-built polling and DOM manipulation strategies.",
        <>
            <span>An action plan was developed, which includes:</span>
            <div className="col-start-1 mt-2">
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Custom user profile system with avatars and visibility
                        settings
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Global real-time chat utilizing custom asynchronous
                        request handling
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        E-commerce integration with a tier-based discount system
                        tied to user achievements
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Auction system for platform placements
                    </p>
                </div>
            </div>
        </>,
        <>
            <div className="col-start-1">
                <span>
                    The technology stack relied strictly on the LAMP stack model
                    with a heavy emphasis on native browser APIs and raw PHP
                    execution, optimized by Nginx for static asset delivery.
                </span>
                <div className="row-center-1 flex-wrap mt-2">
                    {devTools.gmoon.map((tool, i) => (
                        <p
                            className="py-1 px-2 rounded-[12px] border-1 border-current/30 text-[12px]!"
                            key={i}
                        >
                            {tool}
                        </p>
                    ))}
                </div>
            </div>
        </>,
        `The design was dark-themed and community-centric, highly customized to match the underground, niche vibe of the store's products.`,
        `Development required writing custom utility functions for everything from DOM diffing to secure session management, resulting in an exceptionally tailored, if unconventional, codebase.`,
        <div>
            <span>The testing was divided into 3 stages:</span>
            <div className="col-start-1 mt-2">
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Cross-browser testing ensuring Vanilla JS functions
                        properly on older environments
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Security audits for raw SQL and PHP execution
                        (preventing XSS/SQLi in chat inputs)
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Load testing the custom polling mechanisms for the
                        global chat
                    </p>
                </Block>
            </div>
        </div>,
        <div className="col-start-3">
            Infrastructure relied on a monolithic but highly optimized server
            setup. Nginx served as the reverse proxy, efficiently directing
            requests to PHP-FPM while handling static asset caching directly.
            <GraphDiagram edges={edgesGmoon} className="col-stretch-14">
                <div className="row-center-2 justify-between w-full mt-4">
                    <DynamicSvgIcon
                        name="dev"
                        data-tree-node="root"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="github"
                        data-tree-node="root-a"
                        className="size-8 fill-curr"
                    />
                </div>
                <div className="row-center-1 w-full justify-center mt-8">
                    <DynamicSvgIcon
                        name="server"
                        data-tree-node="level-1-a"
                        className="size-8 fill-curr"
                    />
                </div>
                <div className="row-center-1 w-full justify-center mt-8">
                    <DynamicSvgIcon
                        name="nginx"
                        data-tree-node="level-2-a"
                        className="size-8 fill-curr"
                    />
                </div>
                <div className="row-center-2 w-full justify-around mt-8">
                    <span
                        className="font-bold text-lg"
                        data-tree-node="level-3-a"
                    >
                        PHP
                    </span>
                    <DynamicSvgIcon
                        name="database"
                        data-tree-node="level-3-b"
                        className="size-8 fill-curr"
                    />
                </div>
            </GraphDiagram>
        </div>,
        `The project successfully established a tightly-knit community with thousands of active messages and integrated sales, proving that highly interactive web platforms can still be built effectively without heavy modern JS frameworks.`,
    ],

    learningCrm: [
        `This custom CRM was built to support complex business logic and provide deep control over users, inventory, and order pipelines, constructed entirely with a traditional PHP and Vanilla JS stack.`,
        "The goal was to replace fragmented SaaS tools with a unified, self-hosted system tailored exactly to the business's operational flow—from role-based access to third-party logistics integrations.",
        "Developing a secure, fast, and highly relational data management system without modern ORMs required meticulous database design and custom routing logic.",
        <>
            <span>An action plan was developed, which includes:</span>
            <div className="col-start-1 mt-2">
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Implementation of Role-Based Access Control (RBAC) and
                        permissions
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Product, inventory, and geo-presence management modules
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Order processing pipeline linked to partner delivery
                        APIs
                    </p>
                </div>
                <div className="row-center-3 w-full">
                    <div className="size-[2px] rotate-45 bg-curr outline-1 outline-offset-3 outline-curr/35" />
                    <p className="text-[12px]! flex-1">
                        Customer review and moderation tools
                    </p>
                </div>
            </div>
        </>,
        <>
            <div className="col-start-1">
                <span>
                    The tech stack remained deliberately traditional to ensure
                    ease of deployment on standard VPS environments, utilizing
                    PHP for business logic, raw SQL for performance, and Vanilla
                    JS for client-side interactivity.
                </span>
                <div className="row-center-1 flex-wrap mt-2">
                    {devTools.crm.map((tool, i) => (
                        <p
                            className="py-1 px-2 rounded-[12px] border-1 border-current/30 text-[12px]!"
                            key={i}
                        >
                            {tool}
                        </p>
                    ))}
                </div>
            </div>
        </>,
        `The UI was utilitarian and data-dense, prioritizing speed of data entry and clarity of dashboards over aesthetic flourishes.`,
        `Development followed strict MVC patterns custom-built in PHP, ensuring that the heavy relational queries required for logistics and order tracking remained highly performant.`,
        <div>
            <span>The testing was divided into 3 stages:</span>
            <div className="col-start-1 mt-2">
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Data integrity and transaction testing for the order
                        pipeline
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Security audits on role-based endpoint protection
                    </p>
                </Block>
                <div className="w-px h-3 border-l-1 border-dashed border-curr/30 ml-3" />
                <Block className="py-2 px-3 row-center-3 rounded-md">
                    <p className="text-[12px]! flex-1 border-l-1 border-curr pl-2">
                        Third-party API integration tests for shipment syncing
                    </p>
                </Block>
            </div>
        </div>,
        <div className="col-start-3">
            Deployed on a classic Nginx/PHP-FPM architecture, the CRM emphasized
            stability and data redundancy. The server environment was hardened
            to protect sensitive customer and business operational data.
            <GraphDiagram edges={edgesCrm} className="col-stretch-14">
                <div className="row-center-2 justify-between w-full mt-4">
                    <DynamicSvgIcon
                        name="dev"
                        data-tree-node="root"
                        className="size-8 fill-curr"
                    />
                    <DynamicSvgIcon
                        name="github"
                        data-tree-node="root-a"
                        className="size-8 fill-curr"
                    />
                </div>
                <div className="row-center-1 w-full justify-center mt-8">
                    <DynamicSvgIcon
                        name="server"
                        data-tree-node="level-1-a"
                        className="size-8 fill-curr"
                    />
                </div>
                <div className="row-center-1 w-full justify-center mt-8">
                    <DynamicSvgIcon
                        name="nginx"
                        data-tree-node="level-2-a"
                        className="size-8 fill-curr"
                    />
                </div>
                <div className="row-center-1 w-full justify-center mt-8">
                    <span
                        className="font-bold text-lg"
                        data-tree-node="level-3-a"
                    >
                        PHP
                    </span>
                </div>
                <div className="row-center-1 w-full justify-center mt-8">
                    <DynamicSvgIcon
                        name="database"
                        data-tree-node="level-4-a"
                        className="size-8 fill-curr"
                    />
                </div>
            </GraphDiagram>
        </div>,
        `The CRM successfully unified the business's core operations, eliminating the need for multiple disparate tools and significantly reducing processing time for orders and customer support.`,
    ],
};
