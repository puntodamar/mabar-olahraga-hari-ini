import {Card, CardContent} from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
    Banknote,
    ChevronDownIcon,
    Clock3Icon,
    DollarSign,
    SquareSplitHorizontal,
    SquareSplitVertical,
    Trophy,
    Wallet
} from "lucide-react";
import {Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle} from "@/components/ui/item";
import Image from "next/image";



export default function CollapsibleCommunity({Community, Place}: {Community: string, Place: string}) {
    return (
        <Card className="mx-auto w-full py-0  max-w-sm shadow-none">
            <CardContent className="py-0 pl-0 pr-2">
                <Collapsible className="rounded-md pl-0">
                    <CollapsibleTrigger className="group/button flex flex-col w-full items-center justify-between rounded-md py-2  hover:cursor-pointer">
                        {/*<SearchResult CommunityName={CommunityName} />*/}
                        <div className="flex flex-row items-center w-full">
                            <Item className="flex flex-row items-center justify-between">
                                <div className="flex flex-row gap-x-2 items-center justify-between w-full">
                                    <div className="flex flex-row gap-x-2 ">
                                        <ItemMedia variant="image">
                                            <Image
                                                src={"https://imageipsum.com/32x32"}
                                                alt={"Midnight City Lights"}
                                                width={32}
                                                height={32}
                                                className="object-cover grayscale w-5 md:w-12"
                                            />
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle className="line-clamp-1 text-left">
                                                <span className="line-clamp-1 text-md">{Community}</span>
                                            </ItemTitle>
                                            <ItemDescription className="text-xs italic line-clamp-1 text-primary">{Place}</ItemDescription>
                                        </ItemContent>
                                    </div>
                                    <ItemContent className="flex-none text-center text-muted block md:hidden">
                                        <ItemDescription>2km</ItemDescription>
                                    </ItemContent>
                                </div>

                            </Item>
                            <ItemContent className="flex-none text-center text-muted hidden mr-2 text-xs md:block ">
                                <ItemDescription>2km</ItemDescription>
                            </ItemContent>
                            <ChevronDownIcon className="h-4 w-4 group-data-panel-open/button:rotate-180" />
                        </div>


                        <CollapsibleContent className=" items-start pl-4 pt-0 text-sm">
                            <ItemGroup className="gap-y-2 border-t-2">
                                <Item role="listitem"  className="grid grid-cols-2">
                                    <ItemContent className="flex flex-row items-center">
                                        <Clock3Icon className="mr-2 h-4 w-4" />
                                        <ItemDescription className="text-primary">19:00 - 22:00</ItemDescription>
                                    </ItemContent>
                                    <ItemContent className="flex flex-row items-center">
                                        <Wallet className="mr-2 h-4 w-4" />
                                        <ItemDescription className="text-primary">20rb</ItemDescription>
                                    </ItemContent>
                                    <ItemContent className="flex flex-row items-center">
                                        <Trophy className="mr-2 h-4 w-4" />
                                        <ItemDescription className="text-primary">Pra-menengah</ItemDescription>
                                    </ItemContent>
                                    <ItemContent className="flex flex-row items-center">
                                        <SquareSplitHorizontal className="mr-2 h-4 w-4" />
                                        <ItemDescription className="text-primary">3 lapangan</ItemDescription>
                                    </ItemContent>
                                </Item>
                                <Item>
                                    <a href="https://www.instagram.com/badmintonharjog.id/" target="_blank" rel="noopener noreferrer" className="flex flex-row gap-x-2 items-center">
                                        <Image src="/images/icons/instagram.svg" width={16} height={16} alt="Instagram" />
                                        <span className="text-primary hover:underline">badmintonharjog.id</span>
                                    </a>
                                    <a href="https://www.tiktok.com/@badmintonharjog.id" target="_blank" rel="noopener noreferrer" className="flex flex-row gap-x-2 items-center">
                                        <Image src="/images/icons/tiktok.svg" width={16} height={16} alt="TikTok" />
                                        <span className="text-primary hover:underline">badmintonharjog.id</span>
                                    </a>
                                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex flex-row gap-x-2 items-center">
                                        <Image src="/images/icons/whatsapp.svg" width={16} height={16} alt="WhatsApp" />
                                        <span className="text-primary hover:underline">081234567890</span>
                                    </a>
                                </Item>
                            </ItemGroup>

                        </CollapsibleContent>
                    </CollapsibleTrigger>

                </Collapsible>
            </CardContent>
        </Card>
    );
}