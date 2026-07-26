import {Card, CardContent} from "@/components/ui/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {
    ChevronDownIcon,
    Clock3Icon,
    MapPinHouse,
    MapPinSearch,
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
                            <Item className="flex flex-row items-center justify-between">
                                <div className="flex flex-row gap-x-2 items-center justify-between w-full">
                                    <div className="flex flex-row gap-x-2 ">
                                        <ItemMedia variant="image">
                                            <Image
                                                src={Schedule.community.image }
                                                alt={Schedule.community.name}
                                                width={25}
                                                height={25}
                                                className="object-contain rounded-full border-primary  w-5 md:w-12"
                                            />
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle className="line-clamp-1 text-left">
                                                <h2 className="line-clamp-1 text-md font-semibold text-title text-nowrap text-ellipsis">{Schedule.community.name}</h2>
                                            </ItemTitle>
                                            <ItemDescription
                                                className="text-xs italic line-clamp-1 text-subtitle text-nowrap text-ellipsis">{Schedule.place.name}
                                            </ItemDescription>
                                        </ItemContent>
                                    </div>
                                    <ItemContent className="flex-none block md:hidden">
                                        <ItemDescription className="text-subtitle text-xs text-center ">

                                            <Badge className="bg-green-100 text-green-700">
                                                2 km
                                            </Badge>
                                        </ItemDescription>
                                    </ItemContent>
                                </div>

                            </Item>
                            <ItemContent className="flex-none  hidden mr-2 md:block ">
                                <ItemDescription className="text-subtitle text-xs text-center ">
                                    <Badge className="bg-green-100  text-green-700">
                                        2 km
                                    </Badge>
                                </ItemDescription>
                            </ItemContent>
                            <ChevronDownIcon className="h-4 w-4 group-data-panel-open/button:rotate-180"/>
                        </div>


                        <CollapsibleContent className=" items-start pl-4 pt-0 text-sm">
                            <ItemGroup className="gap-y-2 border-t-2 border-[#084D1D]">
                                <Item role="listitem" className="grid grid-cols-2">
                                    <ItemContent className="flex flex-row items-center">
                                        <Clock3Icon className="mr-2 h-4 w-4 text-primary"/>
                                        <ItemDescription
                                            className="text-body">{Schedule.timeStart} - {Schedule.timeEnd}</ItemDescription>
                                    </ItemContent>
                                    <ItemContent className="flex flex-row items-center">
                                        <Wallet className="mr-2 h-4 w-4 text-primary"/>
                                        <ItemDescription className="text-body">{Schedule.fee}</ItemDescription>
                                    </ItemContent>
                                    <ItemContent className="flex flex-row items-center">
                                        <Trophy className="mr-2 h-4 w-4 text-primary"/>
                                        <ItemDescription className="text-body">{Schedule.level}</ItemDescription>
                                    </ItemContent>
                                    <ItemContent className="flex flex-row items-center">
                                        <SquareSplitHorizontal className="mr-2 h-4 w-4 text-primary"/>
                                        <ItemDescription className="text-body">{Schedule.courts}</ItemDescription>
                                    </ItemContent>
                                </Item>
                                <Item className="grid grid-cols-2 md:grid-cols-1">
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
                                                className="text-body hover:underline text-nowrap line-clamp-1 text-ellipsis">{Schedule.community.contacts?.instagram}</span>
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
                                                className="text-body hover:underline text-nowrap line-clamp-1 text-ellipsis">
                                                    {Schedule.community.contacts.tiktok}
                                            </span>
                                        </a>
                                    )}

                                </Item>

                            </ItemGroup>

                            <Item>
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