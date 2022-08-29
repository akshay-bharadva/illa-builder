import { FC, memo } from "react"
import {
  dragPreviewStyle,
  iconStyle,
  itemContainerStyle,
  nameStyle,
} from "./style"
import { ComponentItemProps } from "@/page/App/components/WidgetPickerEditor/components/ComponentPanel/interface"
import { useDrag } from "react-dnd"
import { ComponentNode } from "@/redux/currentApp/editor/components/componentsState"
import { generateComponentNode } from "@/utils/generators/generateComponentNode"
import { DragCollectedInfo } from "@/page/App/components/DotPanel/interface"
import { useSelector } from "react-redux"
import { getIllaMode } from "@/redux/config/configSelector"
import { endDrag, startDrag } from "@/utils/drag/drag"

export const ComponentItem: FC<ComponentItemProps> = memo(
  (props: ComponentItemProps) => {
    const { widgetName, icon, id, ...partialDragInfo } = props

    const illaMode = useSelector(getIllaMode)

    const [, dragRef, dragPreviewRef] = useDrag<
      ComponentNode,
      void,
      DragCollectedInfo
    >(
      () => ({
        type: "components",
        canDrag: () => {
          return illaMode === "edit"
        },
        end: (draggedItem, monitor) => {
          endDrag(draggedItem)
        },
        item: () => {
          const item = generateComponentNode({
            widgetName,
            ...partialDragInfo,
          })
          startDrag(item, false)
          return item
        },
      }),
      [illaMode],
    )

    return (
      <div css={itemContainerStyle} ref={dragRef}>
        <div css={dragPreviewStyle} ref={dragPreviewRef} />
        <span css={iconStyle}>{icon}</span>
        <span css={nameStyle}>{widgetName}</span>
      </div>
    )
  },
)

ComponentItem.displayName = "ComponentItem"
