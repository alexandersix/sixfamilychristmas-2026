<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    <div x-data="{ point: $wire.$entangle('{{ $getStatePath() }}') }">
        <p id="{{ $getId() }}-instructions" style="margin-bottom: 12px; font-size: 14px;">Click the subject to keep it near the center in every layout. You can also focus the photo and use the arrow keys. The full original stays unchanged. Default: center, not automatic subject detection.</p>
        @if ($url = $field->getImageUrl())
            <button type="button" aria-label="Choose photo focus" aria-describedby="{{ $getId() }}-instructions" style="display: block; position: relative; padding: 0; border: 0; max-width: 600px; cursor: crosshair;"
                x-on:keydown="const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }; const move = moves[$event.key]; if (!move) return; $event.preventDefault(); point = { x: Math.max(0, Math.min(100, point.x + move[0])), y: Math.max(0, Math.min(100, point.y + move[1])) }"
                x-on:click="if (!$event.detail) return; const box = $el.getBoundingClientRect(); const percent = value => Math.max(0, Math.min(100, Math.round(value))); point = { x: percent(100 * ($event.clientX - box.left) / box.width), y: percent(100 * ($event.clientY - box.top) / box.height) }">
                <img src="{{ $url }}" alt="Full photograph: choose its focal point" style="display: block; width: 100%; height: auto;" />
                <span aria-hidden="true" :style="{ left: point.x + '%', top: point.y + '%' }" style="position: absolute; width: 24px; height: 24px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 0 2px black; transform: translate(-50%, -50%); pointer-events: none;"></span>
            </button>
        @else
            <p style="font-size: 14px;">Upload a photograph to select its focus visually.</p>
        @endif
        <div style="margin-top: 16px;">
            <button type="button" x-on:click="point = { x: 50, y: 50 }" style="text-decoration: underline;">Reset to center</button>
        </div>
    </div>
</x-dynamic-component>
