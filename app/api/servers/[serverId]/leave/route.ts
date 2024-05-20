import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    {params}: {params: {serverId: string}}
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if(!params.serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id //ADMIN cannot leave server
                },
                members: {
                    some: {
                        profileId: profile.id //confirm the one leaving is a member of server
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        });

        return NextResponse.json(server);
    }catch (error) {
        console.log("[SERVER_ID_LEAVE]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}