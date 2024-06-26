import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server"


export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if(!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }
        if(!params.memberId) {
            return new NextResponse("Member ID missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id, // check ADMIN?
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id //No delete ADMIN
                        }
                    }
                }
            },
            include: {
                members: {
                    include:{
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    }
                }
            }
        });
        
        return NextResponse.json(server);
    } catch (error) {
        console.log("[MEMBER_ID_DELETE]", error)
        return new NextResponse("Internal error", {status: 500});
    }
}
export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        const serverId = searchParams.get("serverId");

        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }
        if(!params.memberId) {
            return new NextResponse("Member ID missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id, // check ADMIN?
            },
            data: {
                members: {
                    update:{
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id //who updating is not themself
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[MEMBER_ID_PATCH]", error)
        return new NextResponse("Internal error", {status: 500});
    }
}