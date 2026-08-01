import {Card, CardContent} from "@/components/ui/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {
    ChevronDownIcon,
    Clock3Icon,
    MapPinHouse,
    SquareSplitHorizontal,
    Trophy,
    Wallet
} from "lucide-react";

import { Badge } from "@/components/ui/badge"
import {Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle} from "@/components/ui/item";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Schedule} from "@/src/mappers/schedule-mapper";
import { useVenueStore } from "@/src/stores/venue-store";


export default function ScheduleCard({Schedule}: { Schedule: Schedule}) {

    const setSelectedVenue = useVenueStore(
        (state) => state.setSelectedVenue
    );

    return (
        <Card
            className="mx-auto w-full py-0  max-w-sm hover:shadow-md shadow-primary/20 dark:hover:shadow-primary dark:shadow-lg bg-white">
            <CardContent className="py-0 pl-0 pr-2">
                <Collapsible className="rounded-md pl-0">
                    <CollapsibleTrigger
                        onClick={() => setSelectedVenue(Schedule.place)}
                        className="group/button flex flex-col w-full items-center justify-between rounded-md py-2  hover:cursor-pointer">

                        <div className="flex flex-row items-center w-full">

                            <Item className="flex flex-row items-center justify-between w-full">

                                <div className="flex flex-row gap-x-2 items-center justify-between w-full">

                                    <div className="flex flex-row items-center w-full">
                                        <ItemMedia variant="image">
                                            <Image
                                                src={Schedule.community.image }
                                                alt={Schedule.community.name}
                                                width={25}
                                                height={25}
                                                className="object-contain rounded-full border-primary  w-5 md:w-12"
                                            />
                                        </ItemMedia>

                                        <ItemContent className="pl-2">
                                            {/*<ItemContent className="flex-none block md:hidden">*/}
                                            {/*    <ItemDescription className="text-subtitle text-xs text-center ">*/}

                                            {/*        <Badge className="bg-green-100 text-green-700">*/}
                                            {/*            2 km*/}
                                            {/*        </Badge>*/}
                                            {/*    </ItemDescription>*/}
                                            {/*</ItemContent>*/}

                                            <div className="flex w-full items-center gap-2 text-left ">
                                                <ItemContent className="pl-2">
                                                    <ItemTitle className="font-semibold text-title line-clamp-2">
                                                        {Schedule.community.name}
                                                    </ItemTitle>

                                                    <ItemDescription className="truncate text-xs italic">
                                                        {Schedule.place.name}
                                                    </ItemDescription>
                                                </ItemContent>

                                                <Badge className="shrink-0 bg-green-100 text-green-700">
                                                    2 km
                                                </Badge>
                                            </div>
                                        </ItemContent>
                                    </div>

                                </div>

                            </Item>

                            <ChevronDownIcon className="h-3 w-3 shrink-0 group-data-panel-open/button:rotate-180"/>
                        </div>


                        <CollapsibleContent className=" items-start pl-4 pt-0 text-sm w-full">
                            <ItemGroup className=" border-t-2 border-[#084D1D]">
                                <Item role="listitem" className="grid grid-cols-2 px-0 pt-2">
                                    <ItemContent className="flex flex-row items-center">
                                        <Clock3Icon className="mr-2 h-4 w-4 text-primary"/>
                                        <ItemDescription
                                            className="text-body text-xs md:text-sm">{Schedule.timeStart} - {Schedule.timeEnd}</ItemDescription>
                                    </ItemContent>
                                    <ItemContent className="flex flex-row items-center">
                                        <Wallet className="mr-2 h-4 w-4 text-primary"/>
                                        <ItemDescription className="text-body text-xs md:text-sm">{Schedule.fee}</ItemDescription>
                                    </ItemContent>
                                    <ItemContent className="flex flex-row items-center">
                                        <Trophy className="mr-2 h-4 w-4 text-primary"/>
                                        <ItemDescription className="text-body text-xs md:text-sm">{Schedule.level}</ItemDescription>
                                    </ItemContent>
                                    <ItemContent className="flex flex-row items-center">
                                        <SquareSplitHorizontal className="mr-2 h-4 w-4 text-primary"/>
                                        <ItemDescription className="text-body text-xs md:text-sm">{Schedule.courts}</ItemDescription>
                                    </ItemContent>
                                </Item>
                                <Item className="grid grid-cols-1 p-0">
                                    {Schedule.community.contacts?.whatsapp && (
                                        <a href={`https://wa.me/${Schedule.community.contacts?.whatsapp}`} target="_blank"
                                           rel="noopener noreferrer" className="flex flex-row gap-x-2 items-center">
                                            <Image src="/images/icons/whatsapp.svg" width={16} height={16} alt="WhatsApp"/>
                                            <span
                                                className="text-body hover:underline text-nowrap line-clamp-1 text-ellipsis">{Schedule.community.contacts?.whatsapp}</span>
                                        </a>
                                    )}

                                    {Schedule.community.contacts?.instagram && (
                                        <a href={`https://www.instagram.com/${Schedule.community.contacts?.instagram}`}
                                           target="_blank" rel="noopener noreferrer"
                                           className="flex flex-row gap-x-2 items-center">
                                            <Image src="/images/icons/instagram.svg" width={16} height={16}
                                                   alt="Instagram"/>
                                            <span
                                                className="text-body text-xs md:text-sm hover:underline text-nowrap line-clamp-1 text-ellipsis">{Schedule.community.contacts?.instagram}</span>
                                        </a>
                                    )}

                                    {Schedule.community.contacts?.tiktok && (
                                        <a
                                            href={`https://www.tiktok.com/@${Schedule.community.contacts.tiktok}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-row gap-x-2 items-center"
                                        >
                                            <Image
                                                src="/images/icons/tiktok.svg"
                                                width={16}
                                                height={16}
                                                alt="TikTok"
                                            />
                                            <span
                                                className="text-body text-xs md:text-base hover:underline text-nowrap line-clamp-1 text-ellipsis">
                                                    {Schedule.community.contacts.tiktok}
                                            </span>
                                        </a>
                                    )}

                                </Item>

                            </ItemGroup>

                            <Item className="p-0 pt-4">
                                {Schedule.additionalInfo && (
                                    <div className="text-left mt-2 w-full">
                                        <span className="text-title">Info Tambahan:</span>
                                        <p className="border-dashed border-2 p-2 text-body text-xs whitespace-pre-line">
                                            {Schedule.additionalInfo}
                                        </p>
                                    </div>

                                )}
                            </Item>

                        </CollapsibleContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Item>
                            <Button
                                onClick={() =>
                                    window.open(
                                        `https://www.google.com/maps/dir/?api=1&destination=${Schedule.place.latitude},${Schedule.place.longitude}`,
                                        "_blank"
                                    )
                                }
                                size="sm"
                                className="hover:cursor-pointer w-full text-white">
                                <MapPinHouse data-icon="inline-start "/> <span>Buka Google Map</span>
                            </Button>
                        </Item>

                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}